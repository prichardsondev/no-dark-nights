"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import {
  CropSettings,
  DEFAULT_CROP,
  DEFAULT_SETTINGS,
  LithophaneSettings,
  REFERENCE_SETTINGS,
  SourceImage,
  calculateUncroppedWidth,
  createLithophaneGeometry,
  estimateTriangleCount,
} from "./lithophane-geometry";

type UploadedImage = {
  name: string;
  previewUrl: string;
  source: SourceImage;
};

const STANDARD_SETTINGS: LithophaneSettings = {
  ...REFERENCE_SETTINGS,
  width: 120,
  resolution: 0.5,
  slotWidth: 17,
  adapterThickness: 1.8,
};

type PresetName = "reference" | "standard" | "compact" | "custom";

const settingFields: Array<{
  key: keyof LithophaneSettings;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  help: string;
}> = [
  {
    key: "width",
    label: "Night-light width",
    unit: "mm",
    min: 50,
    max: 150,
    step: 0.1,
    help: "Tip-to-tip width of the curved picture.",
  },
  {
    key: "height",
    label: "Night-light height",
    unit: "mm",
    min: 60,
    max: 160,
    step: 1,
    help: "Overall height of the picture panel.",
  },
  {
    key: "radius",
    label: "Curve radius",
    unit: "mm",
    min: 65,
    max: 220,
    step: 1,
    help: "Higher values make the panel flatter.",
  },
  {
    key: "minThickness",
    label: "Minimum thickness",
    unit: "mm",
    min: 0.4,
    max: 1.5,
    step: 0.05,
    help: "The brightest parts of the finished lithophane.",
  },
  {
    key: "maxThickness",
    label: "Maximum thickness",
    unit: "mm",
    min: 1.8,
    max: 4,
    step: 0.05,
    help: "The darkest parts and the surrounding frame.",
  },
  {
    key: "frameWidth",
    label: "Frame width",
    unit: "mm",
    min: 3,
    max: 15,
    step: 0.5,
    help: "A solid border that protects the detailed image.",
  },
  {
    key: "resolution",
    label: "Detail",
    unit: "mm / pixel",
    min: 0.25,
    max: 1.2,
    step: 0.05,
    help: "Smaller values create larger, more detailed STL files.",
  },
  {
    key: "slotWidth",
    label: "Slot width",
    unit: "mm",
    min: 10,
    max: 30,
    step: 0.1,
    help: "Inside width of the clip that slides onto the light.",
  },
  {
    key: "slotDepth",
    label: "Slot depth",
    unit: "mm",
    min: 8,
    max: 28,
    step: 0.1,
    help: "Straight slot depth before the rounded cap.",
  },
  {
    key: "adapterThickness",
    label: "Adapter thickness",
    unit: "mm",
    min: 1.2,
    max: 5,
    step: 0.05,
    help: "Thickness of the shield-shaped bottom adapter plate.",
  },
  {
    key: "lightDistance",
    label: "Light distance",
    unit: "mm",
    min: 20,
    max: 55,
    step: 1,
    help: "Distance from the bulb center to the smooth image surface.",
  },
];

function safeFilename(filename: string) {
  const base = filename.replace(/\.[^/.]+$/, "");
  return `${base.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") || "night-light"}-lithophane.stl`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function NumberSetting({
  field,
  settings,
  onChange,
  disabled = false,
}: {
  field: (typeof settingFields)[number];
  settings: LithophaneSettings;
  onChange: (key: keyof LithophaneSettings, value: number) => void;
  disabled?: boolean;
}) {
  const value = settings[field.key] as number;
  const formattedValue = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(field.step < 0.1 ? 2 : 1).replace(/\.0$/, "");
  return (
    <label className="setting-field">
      <span className="setting-label">
        <span>{field.label}</span>
        <span className="setting-value">
          {formattedValue} {field.unit}
        </span>
      </span>
      <input
        aria-label={field.label}
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(event) => onChange(field.key, Number(event.target.value))}
        disabled={disabled}
      />
      <span className="setting-help">
        {disabled ? "Calculated automatically from the uncropped photo." : field.help}
      </span>
    </label>
  );
}

function CropPreview({
  image,
  crop,
  settings,
}: {
  image: UploadedImage;
  crop: CropSettings;
  settings: LithophaneSettings;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const width = 900;
    const height = Math.max(500, Math.round(width * (settings.height / settings.width)));
    canvas.width = width;
    canvas.height = height;

    const offscreen = document.createElement("canvas");
    offscreen.width = image.source.width;
    offscreen.height = image.source.height;
    const offscreenContext = offscreen.getContext("2d");
    if (!offscreenContext) return;
    offscreenContext.putImageData(
      new ImageData(
        new Uint8ClampedArray(image.source.data),
        image.source.width,
        image.source.height,
      ),
      0,
      0,
    );

    const angle = 2 * Math.asin(
      Math.min(0.999999, settings.width / (2 * settings.radius)),
    );
    const imageArcLength = Math.max(
      0.1,
      angle * settings.radius - settings.frameWidth * 2,
    );
    const imageHeight = Math.max(0.1, settings.height - settings.frameWidth * 2);
    const targetAspect = imageArcLength / imageHeight;
    const sourceAspect = image.source.width / image.source.height;
    let baseWidth: number;
    let baseHeight: number;
    if (!crop.enabled) {
      baseWidth = image.source.width;
      baseHeight = image.source.height;
    } else if (sourceAspect > targetAspect) {
      baseHeight = image.source.height;
      baseWidth = baseHeight * targetAspect;
    } else {
      baseWidth = image.source.width;
      baseHeight = baseWidth / targetAspect;
    }
    const cropWidth = crop.enabled ? baseWidth / crop.zoom : baseWidth;
    const cropHeight = crop.enabled ? baseHeight / crop.zoom : baseHeight;
    const sourceX = crop.enabled
      ? (image.source.width - cropWidth) * crop.positionX
      : 0;
    const sourceY = crop.enabled
      ? (image.source.height - cropHeight) * crop.positionY
      : 0;

    context.fillStyle = "#080f19";
    context.fillRect(0, 0, width, height);
    context.filter = `grayscale(1) contrast(${settings.contrast})`;
    context.drawImage(
      offscreen,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      0,
      0,
      width,
      height,
    );
    context.filter = "none";
    context.globalCompositeOperation = "screen";
    const glow = context.createRadialGradient(
      width / 2,
      height * 0.55,
      20,
      width / 2,
      height * 0.55,
      width * 0.7,
    );
    glow.addColorStop(0, "rgba(255, 229, 159, .58)");
    glow.addColorStop(0.5, "rgba(255, 180, 83, .18)");
    glow.addColorStop(1, "rgba(2, 7, 14, .38)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = "rgba(255, 232, 178, .72)";
    context.lineWidth = Math.max(10, width * (settings.frameWidth / settings.width));
    context.strokeRect(0, 0, width, height);
  }, [crop, image, settings]);

  return <canvas ref={canvasRef} className="glow-canvas" />;
}

function ModelPreview({
  image,
  crop,
  settings,
}: {
  image: UploadedImage;
  crop: CropSettings;
  settings: LithophaneSettings;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000);
    camera.position.set(155, -175, 110);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const geometry = createLithophaneGeometry(image.source, crop, settings, true);
    geometry.center();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffedc2,
      roughness: 0.56,
      metalness: 0,
      transmission: 0.08,
      thickness: 0.8,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = Math.PI;
    scene.add(mesh);

    const amber = new THREE.PointLight(0xffb95f, 90, 450);
    amber.position.set(0, 10, 40);
    scene.add(amber);
    const softbox = new THREE.DirectionalLight(0xfff6dc, 3.2);
    softbox.position.set(-80, -120, 160);
    scene.add(softbox);
    scene.add(new THREE.AmbientLight(0x4d6a87, 1.4));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 130;
    controls.maxDistance = 390;
    controls.target.set(0, 5, 0);

    let frame = 0;
    const render = () => {
      controls.update();
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = mount.clientWidth;
      const nextHeight = mount.clientHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    });
    resizeObserver.observe(mount);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [crop, image, settings]);

  return <div ref={mountRef} className="model-mount" />;
}

export function LithophaneStudio() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [settings, setSettings] =
    useState<LithophaneSettings>(DEFAULT_SETTINGS);
  const [crop, setCrop] = useState<CropSettings>(DEFAULT_CROP);
  const [preset, setPreset] = useState<PresetName>("reference");
  const [view, setView] = useState<"model" | "glow">("model");
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (image) URL.revokeObjectURL(image.previewUrl);
    },
    [image],
  );

  const modelSettings = useMemo(() => {
    if (!image || crop.enabled) return settings;
    return {
      ...settings,
      width: calculateUncroppedWidth(
        image.source.width / image.source.height,
        settings,
      ),
    };
  }, [crop.enabled, image, settings]);

  const triangles = useMemo(
    () => estimateTriangleCount(modelSettings),
    [modelSettings],
  );
  const estimatedSize = (84 + triangles * 50) / 1024 / 1024;

  const updateSetting = (key: keyof LithophaneSettings, value: number) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setPreset("custom");
  };

  const loadFile = async (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setNotice("Please choose a JPG, PNG, or WebP photo.");
      return;
    }
    if (file.size > 24 * 1024 * 1024) {
      setNotice("That photo is over 24 MB. A smaller copy will work better.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const bitmap = await createImageBitmap(file);
    const maxDimension = 2400;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      setNotice("This browser could not read that photo.");
      return;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const imageData = context.getImageData(0, 0, width, height);
    setImage((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return {
        name: file.name,
        previewUrl,
        source: {
          data: imageData.data,
          width,
          height,
        },
      };
    });
    setCrop(DEFAULT_CROP);
    setNotice(null);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    void loadFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void loadFile(event.dataTransfer.files?.[0]);
  };

  const generateStl = async () => {
    if (!image) {
      fileInputRef.current?.click();
      return;
    }
    if (modelSettings.maxThickness <= modelSettings.minThickness) {
      setNotice("Maximum thickness needs to be greater than minimum thickness.");
      return;
    }
    if (modelSettings.width >= modelSettings.radius * 1.96) {
      setNotice("Increase the curve radius or reduce the night-light width.");
      return;
    }

    setIsGenerating(true);
    setNotice("Building the printable model on this device…");
    await new Promise((resolve) => window.setTimeout(resolve, 40));
    try {
      const geometry = createLithophaneGeometry(
        image.source,
        crop,
        modelSettings,
      );
      const mesh = new THREE.Mesh(geometry);
      const exporter = new STLExporter();
      const result = exporter.parse(mesh, { binary: true });
      const bytes =
        result instanceof DataView
          ? new Uint8Array(result.buffer, result.byteOffset, result.byteLength)
          : new TextEncoder().encode(result);
      downloadBlob(
        new Blob([bytes.slice().buffer], { type: "model/stl" }),
        safeFilename(image.name),
      );
      geometry.dispose();
      setNotice("Your STL is ready. Check it in your slicer before printing.");
    } catch {
      setNotice("The model could not be generated. Try a larger detail value.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
    setCrop(DEFAULT_CROP);
    setPreset("reference");
    setNotice(null);
  };

  return (
    <main className="studio-shell">
      <header className="topbar">
        <a className="brand" href="https://nodarknights.com/" aria-label="No Dark Nights home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-moon" />
            <span className="brand-lamp" />
          </span>
          <span>
            <strong>No Dark Nights</strong>
            <small>Night-light studio</small>
          </span>
        </a>
        <div className="steps" aria-label="Workflow">
          <span className={image ? "complete" : "active"}>1&nbsp; Photo</span>
          <i />
          <span className={image ? "active" : ""}>2&nbsp; Tune</span>
          <i />
          <span>3&nbsp; Print</span>
        </div>
        <a className="shop-link" href="https://nodarknights.com/">
          Visit No Dark Nights
        </a>
      </header>

      <div className="studio-layout">
        <aside className="control-panel">
          <div className="panel-intro">
            <span className="eyebrow">Made for smiles</span>
            <h1>Turn a favorite photo into a little light.</h1>
            <p>
              Shape a curved, print-ready night-light lithophane. Your photo
              stays on this device.
            </p>
          </div>

          <section className="control-section">
            <div className="section-heading">
              <span>01</span>
              <div>
                <h2>Choose a photo</h2>
                <p>Clear faces and good contrast work best.</p>
              </div>
            </div>
            <div
              className={`drop-zone ${isDragging ? "dragging" : ""} ${image ? "has-image" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.previewUrl} alt="" />
                  <div>
                    <strong>{image.name}</strong>
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      Replace photo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="upload-symbol" aria-hidden="true">＋</span>
                  <div>
                    <strong>Drop a photo here</strong>
                    <button type="button" onClick={() => fileInputRef.current?.click()}>
                      or choose a file
                    </button>
                  </div>
                </>
              )}
              <input
                ref={fileInputRef}
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFile}
              />
            </div>
          </section>

          <section className="control-section">
            <div className="section-heading">
              <span>02</span>
              <div>
                <h2>Frame the moment</h2>
                <p>Position the important part inside the light.</p>
              </div>
            </div>
            <label className="toggle-row">
              <span>
                <strong>Crop to a chosen width</strong>
                <small>
                  Leave off to preserve the whole photo and calculate its width
                  like the reference maker.
                </small>
              </span>
              <input
                type="checkbox"
                checked={crop.enabled}
                onChange={(event) => {
                  setCrop((current) => ({
                    ...current,
                    enabled: event.target.checked,
                  }));
                  setPreset("custom");
                }}
              />
            </label>
            <label className="setting-field">
              <span className="setting-label">
                <span>Zoom</span>
                <span className="setting-value">{crop.zoom.toFixed(2)}×</span>
              </span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={crop.zoom}
                onChange={(event) =>
                  setCrop((current) => ({ ...current, zoom: Number(event.target.value) }))
                }
                disabled={!image || !crop.enabled}
              />
            </label>
            <div className="split-controls">
              <label className="setting-field">
                <span className="setting-label">
                  <span>Left / right</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={crop.positionX}
                  onChange={(event) =>
                    setCrop((current) => ({
                      ...current,
                      positionX: Number(event.target.value),
                    }))
                  }
                  disabled={!image || !crop.enabled}
                />
              </label>
              <label className="setting-field">
                <span className="setting-label">
                  <span>Up / down</span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={crop.positionY}
                  onChange={(event) =>
                    setCrop((current) => ({
                      ...current,
                      positionY: Number(event.target.value),
                    }))
                  }
                  disabled={!image || !crop.enabled}
                />
              </label>
            </div>
            <label className="setting-field">
              <span className="setting-label">
                <span>Photo contrast</span>
                <span className="setting-value">{settings.contrast.toFixed(2)}×</span>
              </span>
              <input
                type="range"
                min="0.7"
                max="1.8"
                step="0.02"
                value={settings.contrast}
                onChange={(event) => updateSetting("contrast", Number(event.target.value))}
              />
            </label>
            <label className="toggle-row">
              <span>
                <strong>Invert light and dark</strong>
                <small>Useful for photo negatives.</small>
              </span>
              <input
                type="checkbox"
                checked={settings.invert}
                onChange={(event) => {
                  setSettings((current) => ({
                    ...current,
                    invert: event.target.checked,
                  }));
                  setPreset("custom");
                }}
              />
            </label>
          </section>

          <section className="control-section">
            <div className="section-heading">
              <span>03</span>
              <div>
                <h2>Fit the night light</h2>
                <p>Reference-matched shield base for the lights used by No Dark Nights.</p>
              </div>
            </div>
            <div className="preset-row">
              <button
                type="button"
                className={`preset ${preset === "reference" ? "active" : ""}`}
                onClick={() => {
                  setSettings(REFERENCE_SETTINGS);
                  setCrop(DEFAULT_CROP);
                  setPreset("reference");
                }}
              >
                Website match
                <small>Auto width · 0.25 mm</small>
              </button>
              <button
                type="button"
                className={`preset ${preset === "standard" ? "active" : ""}`}
                onClick={() => {
                  setSettings(STANDARD_SETTINGS);
                  setCrop((current) => ({ ...current, enabled: true }));
                  setPreset("standard");
                }}
              >
                Standard
                <small>120 × 105 mm</small>
              </button>
              <button
                type="button"
                className={`preset ${preset === "compact" ? "active" : ""}`}
                onClick={() => {
                  setSettings({
                    ...STANDARD_SETTINGS,
                    width: 80,
                  });
                  setCrop((current) => ({ ...current, enabled: true }));
                  setPreset("compact");
                }}
              >
                Compact
                <small>80 × 105 mm</small>
              </button>
            </div>
            {settingFields.slice(0, 3).map((field) => (
              <NumberSetting
                key={field.key}
                field={field}
                settings={modelSettings}
                onChange={updateSetting}
                disabled={field.key === "width" && !crop.enabled}
              />
            ))}
            <details className="advanced">
              <summary>Advanced print & adapter settings</summary>
              <div className="advanced-fields">
                {settingFields.slice(3).map((field) => (
                  <NumberSetting
                    key={field.key}
                    field={field}
                    settings={modelSettings}
                    onChange={updateSetting}
                  />
                ))}
              </div>
            </details>
          </section>
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <div>
              <span className="live-dot" />
              Live preview
            </div>
            <div className="view-toggle" role="group" aria-label="Preview view">
              <button
                type="button"
                className={view === "model" ? "active" : ""}
                onClick={() => setView("model")}
              >
                Model
              </button>
              <button
                type="button"
                className={view === "glow" ? "active" : ""}
                onClick={() => setView("glow")}
              >
                Glow
              </button>
            </div>
          </div>

          <div className={`preview-stage ${image ? "ready" : ""}`}>
            <div className="stars" aria-hidden="true" />
            {image ? (
              view === "model" ? (
                <ModelPreview
                  image={image}
                  crop={crop}
                  settings={modelSettings}
                />
              ) : (
                <div className="glow-wrap">
                  <CropPreview
                    image={image}
                    crop={crop}
                    settings={modelSettings}
                  />
                </div>
              )
            ) : (
              <div className="empty-preview">
                <div className="empty-lithophane" aria-hidden="true">
                  <span />
                </div>
                <span className="eyebrow">Your preview will glow here</span>
                <h2>Start with a photo you love.</h2>
                <p>
                  We&apos;ll turn its light and shadow into printable thickness.
                </p>
                <button type="button" onClick={() => fileInputRef.current?.click()}>
                  Choose a photo
                </button>
              </div>
            )}
          </div>

          <div className="download-dock">
            <div className="model-stats">
              <div>
                <span>Size</span>
                <strong>
                  {modelSettings.width.toFixed(2)} × {modelSettings.height} mm
                </strong>
              </div>
              <div>
                <span>Estimated STL</span>
                <strong>{estimatedSize.toFixed(1)} MB</strong>
              </div>
              <div>
                <span>Privacy</span>
                <strong>Stays on device</strong>
              </div>
            </div>
            {notice && <p className="notice" role="status">{notice}</p>}
            <div className="dock-actions">
              <button type="button" className="reset-button" onClick={reset}>
                Reset settings
              </button>
              <button
                type="button"
                className="generate-button"
                onClick={() => void generateStl()}
                disabled={isGenerating}
              >
                {isGenerating ? "Building model…" : image ? "Download printable STL" : "Choose a photo"}
                <span aria-hidden="true">→</span>
              </button>
            </div>
            <p className="slicer-note">
              Before printing, open the STL in your slicer and confirm the
              adapter dimensions for your exact night-light base.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
