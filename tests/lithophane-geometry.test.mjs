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
      edges.set(key, (edges.get(key) ?? 0) + 1);
    }
  }
  assert.ok([...edges.values()].every((count) => count === 2));
  geometry.dispose();
});
