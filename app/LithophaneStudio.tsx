"use client";

import {
  ChangeEvent,
  Component,
  DragEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
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
import {
  MAX_LABEL_LENGTH,
  createLabelGeometry,
  normalizeLabelText,
} from "./lithophane-label";
import { detectWebGLSupport } from "./webgl-support";

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
    max: 160,
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
    help: "Match the measured thickness of the light housing. Our lights use 16.5 mm.",
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

function createPhotoTexture({
  image,
  crop,
  settings,
}: {
  image: UploadedImage;
  crop: CropSettings;
  settings: LithophaneSettings;
}) {
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = image.source.width;
  sourceCanvas.height = image.source.height;
  const sourceContext = sourceCanvas.getContext("2d");
  if (!sourceContext) return null;
  sourceContext.putImageData(
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
  const canvas = document.createElement("canvas");
  if (targetAspect >= 1) {
    canvas.width = 1024;
    canvas.height = Math.max(1, Math.round(1024 / targetAspect));
  } else {
    canvas.height = 1024;
    canvas.width = Math.max(1, Math.round(1024 * targetAspect));
  }
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (crop.enabled) {
    let baseWidth: number;
    let baseHeight: number;
    if (sourceAspect > targetAspect) {
      baseHeight = image.source.height;
      baseWidth = baseHeight * targetAspect;
    } else {
      baseWidth = image.source.width;
      baseHeight = baseWidth / targetAspect;
    }
    const cropWidth = baseWidth / crop.zoom;
    const cropHeight = baseHeight / crop.zoom;
    const sourceX = (image.source.width - cropWidth) * crop.positionX;
    const sourceY = (image.source.height - cropHeight) * crop.positionY;
    context.drawImage(
      sourceCanvas,
      sourceX,
      sourceY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  } else if (sourceAspect > targetAspect) {
    const destinationHeight = canvas.width / sourceAspect;
    context.drawImage(
      sourceCanvas,
      0,
      (canvas.height - destinationHeight) / 2,
      canvas.width,
      destinationHeight,
    );
  } else {
    const destinationWidth = canvas.height * sourceAspect;
    context.drawImage(
      sourceCanvas,
      (canvas.width - destinationWidth) / 2,
      0,
      destinationWidth,
      canvas.height,
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 124);
  gradient.addColorStop(0, "rgba(255, 248, 214, 1)");
  gradient.addColorStop(0.15, "rgba(255, 204, 103, .78)");
  gradient.addColorStop(0.48, "rgba(255, 146, 41, .28)");
  gradient.addColorStop(1, "rgba(255, 120, 24, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function PreviewUnavailable({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="preview-unavailable" role="status">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="Selected image preview" />
      )}
      <div>
        <span className="eyebrow">Preview unavailable</span>
        <h2>The interactive 3D preview cannot start in this browser.</h2>
        <p>
          Your photo controls still work, and you can still download the
          printable STL. Open the STL in your slicer to inspect the model.
        </p>
      </div>
    </div>
  );
}

class PreviewErrorBoundary extends Component<
  { children: ReactNode; imageUrl?: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // The fallback keeps the Studio usable without exposing browser internals.
  }

  render() {
    if (this.state.failed) {
      return <PreviewUnavailable imageUrl={this.props.imageUrl} />;
    }
    return this.props.children;
  }
}

function ModelPreview({
  image,
  crop,
  settings,
  labelText,
  lit,
  cameraView,
}: {
  image: UploadedImage;
  crop: CropSettings;
  settings: LithophaneSettings;
  labelText: string;
  lit: boolean;
  cameraView: "front" | "angle" | "side";
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [previewUnavailable, setPreviewUnavailable] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    const showUnavailable = () => {
      queueMicrotask(() => {
        if (!cancelled) setPreviewUnavailable(true);
      });
    };
    if (!detectWebGLSupport()) {
      showUnavailable();
      return () => {
        cancelled = true;
      };
    }
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    camera.up.set(0, 0, 1);
    const cameraPositions = {
      front: new THREE.Vector3(0, 330, 10),
      angle: new THREE.Vector3(160, 255, 132),
      side: new THREE.Vector3(330, 12, 32),
    };
    camera.position.copy(cameraPositions[cameraView]);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      showUnavailable();
      return () => {
        cancelled = true;
      };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lit ? 1.38 : 1.05;
    mount.appendChild(renderer.domElement);

    const geometry = createLithophaneGeometry(image.source, crop, settings, true);
    geometry.computeBoundingBox();
    const center = geometry.boundingBox?.getCenter(new THREE.Vector3()) ??
      new THREE.Vector3();
    const photoTexture = createPhotoTexture({ image, crop, settings });
    if (photoTexture) {
      photoTexture.anisotropy = Math.min(
        8,
        renderer.capabilities.getMaxAnisotropy(),
      );
    }
    const angle = 2 * Math.asin(
      Math.min(0.999999, settings.width / (2 * settings.radius)),
    );
    const totalArcLength = angle * settings.radius;
    const imageArcLength = Math.max(
      0.1,
      totalArcLength - settings.frameWidth * 2,
    );
    const imageHeight = Math.max(
      0.1,
      settings.height - settings.frameWidth * 2,
    );
    const circleCenterY =
      settings.slotDepth + settings.lightDistance - settings.radius;
    const material: THREE.Material = lit && photoTexture
      ? new THREE.ShaderMaterial({
          uniforms: {
            photoMap: { value: photoTexture },
            curveAngle: { value: angle },
            totalArcLength: { value: totalArcLength },
            imageArcLength: { value: imageArcLength },
            imageHeight: { value: imageHeight },
            frameWidth: { value: settings.frameWidth },
            circleCenterY: { value: circleCenterY },
            contrast: { value: settings.contrast },
            invertImage: { value: settings.invert ? 1 : 0 },
          },
          vertexShader: `
            varying vec3 vLocalPosition;
            varying vec3 vViewNormal;
            void main() {
              vLocalPosition = position;
              vViewNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D photoMap;
            uniform float curveAngle;
            uniform float totalArcLength;
            uniform float imageArcLength;
            uniform float imageHeight;
            uniform float frameWidth;
            uniform float circleCenterY;
            uniform float contrast;
            uniform int invertImage;
            varying vec3 vLocalPosition;
            varying vec3 vViewNormal;

            void main() {
              float theta = atan(
                vLocalPosition.x,
                vLocalPosition.y - circleCenterY
              );
              float panelU = theta / curveAngle + 0.5;
              float arcPosition = panelU * totalArcLength;
              float imageU = (arcPosition - frameWidth) / imageArcLength;
              float imageV = (vLocalPosition.z - frameWidth) / imageHeight;
              float insideImage =
                step(0.0, imageU) * step(imageU, 1.0) *
                step(0.0, imageV) * step(imageV, 1.0);
              vec3 photo = texture2D(
                photoMap,
                vec2(clamp(1.0 - imageU, 0.0, 1.0), clamp(imageV, 0.0, 1.0))
              ).rgb;
              float luminance = dot(photo, vec3(0.2126, 0.7152, 0.0722));
              luminance = clamp((luminance - 0.5) * contrast + 0.5, 0.0, 1.0);
              if (invertImage == 1) {
                luminance = 1.0 - luminance;
              }
              float transmitted = mix(0.12, 1.0, pow(luminance, 0.88));
              vec3 shadowColor = vec3(0.20, 0.075, 0.018);
              vec3 lightColor = vec3(1.0, 0.86, 0.56);
              vec3 frameColor = vec3(1.0, 0.72, 0.30);
              vec3 color = mix(shadowColor, lightColor, transmitted);
              color = mix(frameColor, color, insideImage);
              float shapeLight =
                0.78 + 0.22 * abs(dot(normalize(vViewNormal), vec3(0.2, 0.45, 0.87)));
              gl_FragColor = vec4(color * shapeLight, 1.0);
            }
          `,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xf4e2b9,
          roughness: 0.68,
          metalness: 0,
          clearcoat: 0.08,
          clearcoatRoughness: 0.72,
          side: THREE.DoubleSide,
        });
    const mesh = new THREE.Mesh(geometry, material);
    const modelGroup = new THREE.Group();
    modelGroup.position.copy(center).multiplyScalar(-1);
    modelGroup.add(mesh);
    const labelGeometry = createLabelGeometry(labelText, settings);
    const labelMaterial = labelGeometry
      ? new THREE.MeshPhysicalMaterial({
          color: lit ? 0x3a1607 : 0xf4e2b9,
          roughness: 0.72,
          metalness: 0,
          side: THREE.DoubleSide,
        })
      : null;
    if (labelGeometry && labelMaterial) {
      modelGroup.add(new THREE.Mesh(labelGeometry, labelMaterial));
    }
    scene.add(modelGroup);

    const glowTexture = lit ? createGlowTexture() : null;
    const glowMaterial = glowTexture
      ? new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0xffae42,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      : null;
    const glowSprite = glowMaterial ? new THREE.Sprite(glowMaterial) : null;
    if (glowSprite) {
      glowSprite.position.set(
        0,
        settings.slotDepth,
        Math.max(30, settings.height * 0.42),
      );
      glowSprite.scale.set(145, 145, 1);
      modelGroup.add(glowSprite);
    }

    if (lit) {
      const bulb = new THREE.PointLight(0xffb34f, 75, 240, 1.45);
      bulb.position.set(0, settings.slotDepth, settings.height * 0.38);
      modelGroup.add(bulb);
      scene.add(new THREE.AmbientLight(0x5e2b12, 0.72));
    } else {
      const key = new THREE.DirectionalLight(0xfff4d8, 4.1);
      key.position.set(-90, 160, 150);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x88b7e3, 2.2);
      rim.position.set(100, -70, 100);
      scene.add(rim);
      scene.add(new THREE.HemisphereLight(0xc8ddf2, 0x33200f, 1.8));
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 145;
    controls.maxDistance = 620;
    controls.target.set(0, 0, 0);

    let frame = 0;
    let renderingFailed = false;
    const render = () => {
      if (renderingFailed) return;
      controls.update();
      try {
        renderer.render(scene, camera);
      } catch {
        renderingFailed = true;
        showUnavailable();
        return;
      }
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
      cancelled = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      geometry.dispose();
      labelGeometry?.dispose();
      labelMaterial?.dispose();
      material.dispose();
      photoTexture?.dispose();
      glowMaterial?.dispose();
      glowTexture?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [cameraView, crop, image, labelText, lit, settings]);

  if (previewUnavailable) {
    return <PreviewUnavailable imageUrl={image.previewUrl} />;
  }

  return (
    <div
      ref={mountRef}
      className="model-mount"
      data-testid="model-preview"
    />
  );
}

export function LithophaneStudio() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [settings, setSettings] =
    useState<LithophaneSettings>(DEFAULT_SETTINGS);
  const [crop, setCrop] = useState<CropSettings>(DEFAULT_CROP);
  const [preset, setPreset] = useState<PresetName>("reference");
  const [view, setView] = useState<"model" | "lit">("lit");
  const [cameraView, setCameraView] =
    useState<"front" | "angle" | "side">("angle");
  const [labelText, setLabelText] = useState("");
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
    const supportedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
      "image/heic",
      "image/heif",
    ]);
    const supportedExtension =
      /\.(?:avif|gif|heic|heif|jpe?g|png|webp)$/i.test(file.name);
    if (
      (!file.type && !supportedExtension) ||
      (file.type && !supportedTypes.has(file.type))
    ) {
      setNotice(
        "Please choose a JPG, PNG, WebP, AVIF, GIF, HEIC, or HEIF photo.",
      );
      return;
    }
    if (file.size > 24 * 1024 * 1024) {
      setNotice("That photo is over 24 MB. A smaller copy will work better.");
      return;
    }

    const originalPreviewUrl = URL.createObjectURL(file);
    let previewUrl = originalPreviewUrl;
    let bitmap: ImageBitmap | null = null;
    try {
      const mightBeHeic =
        /heic|heif/i.test(file.type) || /\.(?:heic|heif)$/i.test(file.name);
      if (mightBeHeic) {
        const { heicTo, isHeic } = await import("heic-to/csp");
        if (!(await isHeic(file))) throw new Error("Invalid HEIC image.");
        bitmap = await heicTo({
          blob: file,
          type: "bitmap",
          options: { imageOrientation: "from-image" },
        });
      } else {
        bitmap = await createImageBitmap(file, {
          imageOrientation: "from-image",
        });
      }
      const maxDimension = 2400;
      const scale = Math.min(
        1,
        maxDimension / Math.max(bitmap.width, bitmap.height),
      );
      const width = Math.max(1, Math.round(bitmap.width * scale));
      const height = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas is unavailable.");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
      context.drawImage(bitmap, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const previewBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });
      if (previewBlob) {
        previewUrl = URL.createObjectURL(previewBlob);
        URL.revokeObjectURL(originalPreviewUrl);
      }
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
    } catch {
      URL.revokeObjectURL(previewUrl);
      if (previewUrl !== originalPreviewUrl) {
        URL.revokeObjectURL(originalPreviewUrl);
      }
      setNotice(
        "That image could not be read. Try exporting it as a JPG or PNG.",
      );
    } finally {
      bitmap?.close();
    }
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
      const labelGeometry = createLabelGeometry(labelText, modelSettings);
      const exportGroup = new THREE.Group();
      exportGroup.add(mesh);
      if (labelGeometry) {
        exportGroup.add(new THREE.Mesh(labelGeometry));
      }
      const exporter = new STLExporter();
      const result = exporter.parse(exportGroup, { binary: true });
      const bytes =
        result instanceof DataView
          ? new Uint8Array(result.buffer, result.byteOffset, result.byteLength)
          : new TextEncoder().encode(result);
      downloadBlob(
        new Blob([bytes.slice().buffer], { type: "model/stl" }),
        safeFilename(image.name),
      );
      geometry.dispose();
      labelGeometry?.dispose();
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
    setLabelText("");
    setNotice(null);
  };

  return (
    <main className="studio-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="No Dark Nights home">
          <span>
            <strong>
              No Dark Nights<span className="brand-dot">.</span>
            </strong>
            <small>Night-light studio</small>
          </span>
        </Link>
        <div className="steps" aria-label="Workflow">
          <span className={image ? "complete" : "active"}>1&nbsp; Photo</span>
          <i />
          <span className={image ? "active" : ""}>2&nbsp; Tune</span>
          <i />
          <span>3&nbsp; Print</span>
        </div>
        <a className="shop-link" href="/learn">
          Learn the project
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
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/heic,image/heif,.heic,.heif"
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
                  automatically.
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
                <p>Start with our usual fit, or adjust it for another light housing.</p>
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
                Default fit
                <small>16.5 mm slot · auto width</small>
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

          <section className="control-section">
            <div className="section-heading">
              <span>04</span>
              <div>
                <h2>Add a name or message</h2>
                <p>Raise custom text on the printable bottom adapter.</p>
              </div>
            </div>
            <label className="text-setting">
              <span className="setting-label">
                <span>Bottom text</span>
                <span className="setting-value">
                  {normalizeLabelText(labelText).length}/{MAX_LABEL_LENGTH}
                </span>
              </span>
              <input
                aria-label="Bottom text"
                type="text"
                maxLength={MAX_LABEL_LENGTH}
                value={labelText}
                placeholder="A name or website"
                onChange={(event) => setLabelText(event.target.value)}
              />
              <span className="setting-help">
                The text follows the adapter curve and automatically fits the
                available width. Leave blank for no text.
              </span>
            </label>
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
                className={view === "lit" ? "active" : ""}
                onClick={() => setView("lit")}
              >
                Night light
              </button>
            </div>
          </div>

          <div className={`preview-stage ${image ? "ready" : ""}`}>
            <div className="stars" aria-hidden="true" />
            {image ? (
              <>
                <PreviewErrorBoundary
                  key={image.previewUrl}
                  imageUrl={image.previewUrl}
                >
                  <ModelPreview
                    image={image}
                    crop={crop}
                    settings={modelSettings}
                    labelText={labelText}
                    lit={view === "lit"}
                    cameraView={cameraView}
                  />
                </PreviewErrorBoundary>
                <div
                  className="camera-toggle"
                  role="group"
                  aria-label="Camera angle"
                >
                  {([
                    ["front", "Front"],
                    ["angle", "3/4"],
                    ["side", "Side"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={cameraView === value ? "active" : ""}
                      aria-pressed={cameraView === value}
                      onClick={() => setCameraView(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="preview-hint">
                  Drag to rotate · Scroll to zoom
                </div>
              </>
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
