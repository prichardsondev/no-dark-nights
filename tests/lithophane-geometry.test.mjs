import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_CROP,
  REFERENCE_SETTINGS,
  calculateUncroppedWidth,
  createLithophaneGeometry,
} from "../app/lithophane-geometry.ts";

test("reference image aspect ratio reproduces the website width", () => {
  const width = calculateUncroppedWidth(
    1308 / 1203,
    REFERENCE_SETTINGS,
  );
  assert.ok(Math.abs(width - 103.73) < 0.01);
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
  const edges = new Map();
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
  assert.ok(
    [...edges.values()].every(
      ({ count, direction }) => count === 2 && direction === 0,
    ),
  );
  assert.ok(signedVolume > 0, "outward faces should produce positive volume");
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
