import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_CROP,
  REFERENCE_SETTINGS,
  calculateUncroppedWidth,
  createLithophaneGeometry,
} from "../app/lithophane-geometry.ts";
import {
  DEFAULT_LABEL_SIZE,
  LABEL_RAISE,
  MAX_LABEL_SIZE,
  MAX_LABEL_LENGTH,
  MIN_LABEL_SIZE,
  createLabelGeometry,
  normalizeLabelText,
} from "../app/lithophane-label.ts";

function solidSource(width, height, value = 128) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let offset = 0; offset < data.length; offset += 4) {
    data[offset] = value;
    data[offset + 1] = value;
    data[offset + 2] = value;
    data[offset + 3] = 255;
  }
  return { data, width, height };
}

function edgeStats(geometry) {
  const index = geometry.getIndex();
  const edges = new Map();
  for (let offset = 0; offset < index.count; offset += 3) {
    const triangle = [
      index.getX(offset),
      index.getX(offset + 1),
      index.getX(offset + 2),
    ];
    for (const [a, b] of [
      [triangle[0], triangle[1]],
      [triangle[1], triangle[2]],
      [triangle[2], triangle[0]],
    ]) {
      const key = a < b ? `${a},${b}` : `${b},${a}`;
      const edge = edges.get(key) ?? { count: 0, direction: 0 };
      edge.count += 1;
      edge.direction += a < b ? 1 : -1;
      edges.set(key, edge);
    }
  }
  return [...edges.values()];
}

test("reference image aspect ratio reproduces the website width", () => {
  const width = calculateUncroppedWidth(
    1308 / 1203,
    REFERENCE_SETTINGS,
  );
  assert.ok(Math.abs(width - 103.73) < 0.01);
});

test("adapter thickness matches its slider step and displayed precision", () => {
  const minimum = 1.2;
  const step = 0.05;
  const stepsFromMinimum =
    (REFERENCE_SETTINGS.adapterThickness - minimum) / step;

  assert.ok(Math.abs(stepsFromMinimum - Math.round(stepsFromMinimum)) < 1e-9);
  assert.equal(REFERENCE_SETTINGS.adapterThickness.toFixed(2), "3.25");
});

test("custom text is fitted and raised on the bottom adapter", () => {
  const settings = { ...REFERENCE_SETTINGS, width: 80 };
  const text = normalizeLabelText(
    `  NoDarkNights.com ${"x".repeat(MAX_LABEL_LENGTH)}  `,
  );
  assert.equal(Array.from(text).length, MAX_LABEL_LENGTH);

  const geometry = createLabelGeometry("NoDarkNights.com", settings);
  assert.ok(geometry);
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  assert.ok(bounds);
  assert.ok(bounds.min.x >= -settings.width / 2);
  assert.ok(bounds.max.x <= settings.width / 2);
  assert.ok(bounds.min.y > settings.slotDepth + settings.slotWidth / 2);
  assert.equal(bounds.min.z, 0);
  assert.ok(
    Math.abs(
      bounds.max.z - (settings.adapterThickness + LABEL_RAISE),
    ) < 1e-5,
  );
  geometry.dispose();
});

test("bottom text size is adjustable and remains inside the adapter", () => {
  const settings = { ...REFERENCE_SETTINGS, width: 80 };
  assert.equal(DEFAULT_LABEL_SIZE, 8);

  const small = createLabelGeometry("tint", settings, MIN_LABEL_SIZE);
  const large = createLabelGeometry("tint", settings, MAX_LABEL_SIZE);
  assert.ok(small);
  assert.ok(large);
  small.computeBoundingBox();
  large.computeBoundingBox();
  assert.ok(small.boundingBox);
  assert.ok(large.boundingBox);
  assert.ok(
    large.boundingBox.max.y - large.boundingBox.min.y >
      small.boundingBox.max.y - small.boundingBox.min.y,
  );

  const long = createLabelGeometry(
    "A longer kind message here",
    settings,
    MAX_LABEL_SIZE,
  );
  assert.ok(long);
  long.computeBoundingBox();
  assert.ok(long.boundingBox);
  assert.ok(long.boundingBox.min.x >= -settings.width / 2);
  assert.ok(long.boundingBox.max.x <= settings.width / 2);

  small.dispose();
  large.dispose();
  long.dispose();
});

test("generated night light is build-plate oriented and manifold", () => {
  const source = {
    data: new Uint8ClampedArray([
      0, 0, 0, 255,
      255, 255, 255, 255,
      255, 255, 255, 255,
      0, 0, 0, 255,
    ]),
    width: 2,
    height: 2,
  };
  const settings = {
    ...REFERENCE_SETTINGS,
    width: 80,
    height: 65,
    resolution: 2,
  };
  const geometry = createLithophaneGeometry(
    source,
    DEFAULT_CROP,
    settings,
  );
  geometry.computeBoundingBox();

  assert.equal(geometry.boundingBox.min.z, 0);
  assert.equal(geometry.boundingBox.max.z, 65);

  const index = geometry.getIndex();
  const positions = geometry.getAttribute("position");
  let signedVolume = 0;
  for (let offset = 0; offset < index.count; offset += 3) {
    const triangle = [
      index.getX(offset),
      index.getX(offset + 1),
      index.getX(offset + 2),
    ];
    const [a, b, c] = triangle.map((vertex) => ({
      x: positions.getX(vertex),
      y: positions.getY(vertex),
      z: positions.getZ(vertex),
    }));
    signedVolume += (
      a.x * (b.y * c.z - b.z * c.y) -
      a.y * (b.x * c.z - b.z * c.x) +
      a.z * (b.x * c.y - b.y * c.x)
    ) / 6;
  }
  assert.ok(
    edgeStats(geometry).every(
      ({ count, direction }) => count === 2 && direction === 0,
    ),
  );
  assert.ok(signedVolume > 0, "outward faces should produce positive volume");
  geometry.dispose();
});

test("extreme portrait and panorama images remain printable", () => {
  for (const [width, height] of [
    [1, 24],
    [24, 1],
    [1, 1],
  ]) {
    const fittedWidth = calculateUncroppedWidth(
      width / height,
      REFERENCE_SETTINGS,
    );
    assert.ok(fittedWidth >= 40 - 1e-6);
    assert.ok(fittedWidth < REFERENCE_SETTINGS.radius * 1.96);

    const geometry = createLithophaneGeometry(
      solidSource(width, height),
      DEFAULT_CROP,
      {
        ...REFERENCE_SETTINGS,
        width: fittedWidth,
        height: 65,
        resolution: 2,
      },
    );
    const positions = geometry.getAttribute("position");
    for (let vertex = 0; vertex < positions.count; vertex += 1) {
      assert.ok(Number.isFinite(positions.getX(vertex)));
      assert.ok(Number.isFinite(positions.getY(vertex)));
      assert.ok(Number.isFinite(positions.getZ(vertex)));
    }
    assert.ok(
      edgeStats(geometry).every(
        ({ count, direction }) => count === 2 && direction === 0,
      ),
    );
    geometry.dispose();
  }
});

test("uncropped panoramas are contained instead of stretched", () => {
  const source = solidSource(24, 1, 0);
  const settings = {
    ...REFERENCE_SETTINGS,
    width: calculateUncroppedWidth(24, REFERENCE_SETTINGS),
    resolution: 1,
  };
  const geometry = createLithophaneGeometry(
    source,
    DEFAULT_CROP,
    settings,
  );
  const positions = geometry.getAttribute("position");
  const centerY =
    settings.slotDepth + settings.lightDistance - settings.radius;
  const radiusNear = (targetZ) => {
    let closest = Number.POSITIVE_INFINITY;
    let outerRadius = 0;
    for (let vertex = 0; vertex < positions.count; vertex += 1) {
      const x = positions.getX(vertex);
      const z = positions.getZ(vertex);
      if (Math.abs(x) > 1.5) continue;
      const distance = Math.abs(z - targetZ);
      const radius = Math.hypot(
        x,
        positions.getY(vertex) - centerY,
      );
      if (distance < closest - 1e-4) {
        closest = distance;
        outerRadius = radius;
      } else if (Math.abs(distance - closest) < 1e-4) {
        outerRadius = Math.max(outerRadius, radius);
      }
    }
    return outerRadius;
  };

  assert.ok(
    radiusNear(52) - radiusNear(14) > 1.5,
    "letterboxed white space should be thinner than the black panorama",
  );
  geometry.dispose();
});

test("image left and right map to the same sides as the reference generator", () => {
  const source = {
    data: new Uint8ClampedArray([
      0, 0, 0, 255,
      255, 255, 255, 255,
      0, 0, 0, 255,
      255, 255, 255, 255,
    ]),
    width: 2,
    height: 2,
  };
  const settings = {
    ...REFERENCE_SETTINGS,
    width: 80,
    height: 65,
    frameWidth: 4,
    resolution: 1,
  };
  const geometry = createLithophaneGeometry(
    source,
    DEFAULT_CROP,
    settings,
  );
  const positions = geometry.getAttribute("position");
  const circleCenterY =
    settings.slotDepth + settings.lightDistance - settings.radius;
  const sideRadii = { left: [], right: [] };
  for (let vertex = 0; vertex < positions.count; vertex += 1) {
    const x = positions.getX(vertex);
    const y = positions.getY(vertex);
    const z = positions.getZ(vertex);
    if (z < 25 || z > 40 || Math.abs(x) < 8 || Math.abs(x) > 24) continue;
    const radius = Math.hypot(x, y - circleCenterY);
    sideRadii[x < 0 ? "left" : "right"].push(radius);
  }
  const leftOuter = Math.max(...sideRadii.left);
  const rightOuter = Math.max(...sideRadii.right);

  assert.ok(
    rightOuter - leftOuter > 1.5,
    "the dark left image half should create the thicker positive-X relief",
  );
  geometry.dispose();
});
