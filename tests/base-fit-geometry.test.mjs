import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  ADAPTER_ENTRY_LIP_WIDTH,
  SLOT_WIDTH_MAX,
  SLOT_WIDTH_MIN,
  createAdapterSlotProfile,
} from "../app/adapter-slot-profile.ts";
import {
  FIT_FINDER_BUILD_PLATE,
  FIT_LABEL_RAISE,
  createFitFinderParts,
  fitFinderFilename,
  normalizeFitFinder,
  withFitFinderSlotWidth,
} from "../app/base-fit-geometry.ts";
import {
  DEFAULT_CROP,
  REFERENCE_SETTINGS,
  createLithophaneGeometry,
} from "../app/lithophane-geometry.ts";

function positionKey(x, y, z) {
  return `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
}

function triangleStats(geometry) {
  const positions = geometry.getAttribute("position");
  const index = geometry.getIndex();
  const count = index?.count ?? positions.count;
  const seen = new Set();
  let degenerate = 0;
  let duplicate = 0;
  let signedVolume = 0;

  for (let offset = 0; offset < count; offset += 3) {
    const ids = [0, 1, 2].map((item) =>
      index ? index.getX(offset + item) : offset + item,
    );
    const points = ids.map((id) => [
      positions.getX(id),
      positions.getY(id),
      positions.getZ(id),
    ]);
    const [a, b, c] = points;
    const ab = b.map((value, item) => value - a[item]);
    const ac = c.map((value, item) => value - a[item]);
    const cross = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    if (Math.hypot(...cross) < 1e-7) degenerate += 1;
    const key = points
      .map((point) => positionKey(...point))
      .sort()
      .join("|");
    if (seen.has(key)) duplicate += 1;
    seen.add(key);
    signedVolume +=
      (a[0] * (b[1] * c[2] - b[2] * c[1]) -
        a[1] * (b[0] * c[2] - b[2] * c[0]) +
        a[2] * (b[0] * c[1] - b[1] * c[0])) /
      6;
  }

  return { degenerate, duplicate, signedVolume };
}

function edgeStats(geometry) {
  const clone = geometry.clone();
  for (const name of Object.keys(clone.attributes)) {
    if (name !== "position") clone.deleteAttribute(name);
  }
  const welded = mergeVertices(clone, 1e-4);
  clone.dispose();
  const index = welded.getIndex();
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
  welded.dispose();
  return [...edges.values()];
}

function hasVertex(geometry, x, y, z) {
  const positions = geometry.getAttribute("position");
  for (let vertex = 0; vertex < positions.count; vertex += 1) {
    if (
      Math.abs(positions.getX(vertex) - x) < 1e-4 &&
      Math.abs(positions.getY(vertex) - y) < 1e-4 &&
      Math.abs(positions.getZ(vertex) - z) < 1e-4
    ) {
      return true;
    }
  }
  return false;
}

test("Fit Finder defaults to 16.0, 16.5, and 17.0 mm", () => {
  const result = normalizeFitFinder(16.5, 0.5);
  assert.deepEqual(result.widths, [16, 16.5, 17]);
  assert.equal(result.correction, null);
  assert.equal(
    fitFinderFilename(result.widths),
    "base-fit-finder-16.0-16.5-17.0.stl",
  );
});

test("Fit Finder validates NaN, negative, boundary, and alternate spacing values", () => {
  const invalid = normalizeFitFinder(Number.NaN, 0.5);
  assert.equal(invalid.center, 16.5);
  assert.match(invalid.correction, /restored/i);
  const negative = normalizeFitFinder(-5, 0.5);
  assert.deepEqual(negative.widths, [10, 10.5, 11]);
  assert.match(negative.correction, /between 10 and 30/i);
  const high = normalizeFitFinder(35, 0.5);
  assert.deepEqual(high.widths, [29, 29.5, 30]);
  const fine = normalizeFitFinder(16.5, 0.25);
  assert.deepEqual(fine.widths, [16.25, 16.5, 16.75]);
  assert.equal(new Set(fine.widths).size, 3);
  assert.ok(fine.widths.every((width) => width >= 10 && width <= 30));
});

test("choosing a coupon changes only the production slot width", () => {
  const next = withFitFinderSlotWidth(REFERENCE_SETTINGS, 17);
  assert.equal(next.slotWidth, 17);
  assert.deepEqual(
    { ...next, slotWidth: REFERENCE_SETTINGS.slotWidth },
    REFERENCE_SETTINGS,
  );
});

test("shared adapter profile preserves slot depth, rounded cap, opening, and 5 mm lips", () => {
  const profile = createAdapterSlotProfile({
    slotWidth: 16.5,
    slotDepth: 17,
  });
  assert.equal(ADAPTER_ENTRY_LIP_WIDTH, 5);
  assert.equal(profile.halfSlot, 8.25);
  assert.equal(profile.capY, 25.25);
  assert.deepEqual(profile.boundary[0], { x: -8.25, y: 0 });
  assert.deepEqual(profile.boundary.at(-1), { x: 8.25, y: 0 });
  assert.deepEqual(profile.leftLip, { x: -13.25, y: 0 });
  assert.deepEqual(profile.rightLip, { x: 13.25, y: 0 });
  assert.equal(SLOT_WIDTH_MIN, 10);
  assert.equal(SLOT_WIDTH_MAX, 30);
});

test("each coupon is flat, outward, manifold, clean, and uses the exact shared profile", () => {
  const parts = createFitFinderParts([16, 16.5, 17]);
  for (const part of parts) {
    const profile = createAdapterSlotProfile({
      slotWidth: part.slotWidth,
      slotDepth: REFERENCE_SETTINGS.slotDepth,
    });
    const base = part.baseGeometry;
    const label = part.labelGeometry;
    assert.equal(base.boundingBox.min.z, 0);
    assert.equal(base.boundingBox.max.z, REFERENCE_SETTINGS.adapterThickness);
    for (const z of [0, REFERENCE_SETTINGS.adapterThickness]) {
      for (const point of [
        profile.boundary[0],
        profile.boundary.at(-1),
        profile.leftLip,
        profile.rightLip,
      ]) {
        assert.ok(
          hasVertex(
            base,
            point.x + (base.boundingBox.min.x + base.boundingBox.max.x) / 2,
            point.y,
            z,
          ),
        );
      }
    }
    assert.ok(
      edgeStats(base).every(
        ({ count, direction }) => count === 2 && direction === 0,
      ),
    );
    assert.ok(
      edgeStats(label).every(
        ({ count, direction }) => count === 2 && direction === 0,
      ),
    );
    assert.deepEqual(
      {
        degenerate: triangleStats(base).degenerate,
        duplicate: triangleStats(base).duplicate,
      },
      { degenerate: 0, duplicate: 0 },
    );
    assert.deepEqual(
      {
        degenerate: triangleStats(label).degenerate,
        duplicate: triangleStats(label).duplicate,
      },
      { degenerate: 0, duplicate: 0 },
    );
    assert.ok(triangleStats(base).signedVolume > 0);
    assert.equal(part.label, part.slotWidth.toFixed(1));
    assert.ok(label.boundingBox.min.y > profile.capY);
    assert.ok(
      Math.abs(
        label.boundingBox.max.z -
          (REFERENCE_SETTINGS.adapterThickness - 0.05 + FIT_LABEL_RAISE),
      ) < 1e-5,
    );
  }
  for (let index = 1; index < parts.length; index += 1) {
    assert.ok(
      parts[index - 1].baseGeometry.boundingBox.max.x <
        parts[index].baseGeometry.boundingBox.min.x,
    );
  }
  for (const part of parts) {
    part.baseGeometry.dispose();
    part.labelGeometry.dispose();
  }
});

test("complete Fit Finder output has three separated labeled spatial pieces and fits 180 mm", () => {
  const parts = createFitFinderParts([16, 16.5, 17]);
  const group = new THREE.Group();
  for (const part of parts) {
    group.add(new THREE.Mesh(part.baseGeometry));
    group.add(new THREE.Mesh(part.labelGeometry));
  }
  const output = new STLExporter().parse(group, { binary: true });
  assert.ok(output instanceof DataView);
  const triangleCount = output.getUint32(80, true);
  assert.equal(output.byteLength, 84 + triangleCount * 50);
  const clusters = [0, 0, 0];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  for (let triangle = 0; triangle < triangleCount; triangle += 1) {
    const offset = 84 + triangle * 50 + 12;
    const xs = [0, 1, 2].map((vertex) =>
      output.getFloat32(offset + vertex * 12, true),
    );
    const ys = [0, 1, 2].map((vertex) =>
      output.getFloat32(offset + vertex * 12 + 4, true),
    );
    const zs = [0, 1, 2].map((vertex) =>
      output.getFloat32(offset + vertex * 12 + 8, true),
    );
    minX = Math.min(minX, ...xs);
    maxX = Math.max(maxX, ...xs);
    minY = Math.min(minY, ...ys);
    maxY = Math.max(maxY, ...ys);
    minZ = Math.min(minZ, ...zs);
    const centerX = xs.reduce((sum, value) => sum + value, 0) / 3;
    const cluster = parts.findIndex(
      (part) =>
        centerX >= part.baseGeometry.boundingBox.min.x &&
        centerX <= part.baseGeometry.boundingBox.max.x,
    );
    assert.notEqual(cluster, -1);
    clusters[cluster] += 1;
  }
  assert.ok(clusters.every((count) => count > 152));
  assert.ok(maxX - minX <= FIT_FINDER_BUILD_PLATE);
  assert.ok(maxY - minY <= FIT_FINDER_BUILD_PLATE);
  assert.equal(minZ, 0);
  for (const part of parts) {
    part.baseGeometry.dispose();
    part.labelGeometry.dispose();
  }
});

test("Fit Finder follows selected production slot depth and adapter thickness", () => {
  const settings = { slotDepth: 21, adapterThickness: 2.4 };
  const parts = createFitFinderParts([16, 16.5, 17], settings);
  const [part] = parts;
  const profile = createAdapterSlotProfile({
    slotWidth: 16,
    slotDepth: settings.slotDepth,
  });
  assert.ok(Math.abs(part.baseGeometry.boundingBox.max.z - 2.4) < 1e-5);
  assert.equal(part.baseGeometry.boundingBox.max.y, profile.capY + 14);
  assert.ok(part.labelGeometry.boundingBox.min.y > profile.capY);
  for (const candidate of parts) {
    candidate.baseGeometry.dispose();
    candidate.labelGeometry.dispose();
  }
});

test("shared-profile refactor leaves the full reference lithophane output unchanged", () => {
  const data = new Uint8ClampedArray(4 * 4 * 4);
  for (let offset = 0; offset < data.length; offset += 4) {
    data[offset] = (offset * 7) % 256;
    data[offset + 1] = (offset * 11) % 256;
    data[offset + 2] = (offset * 13) % 256;
    data[offset + 3] = 255;
  }
  const geometry = createLithophaneGeometry(
    { data, width: 4, height: 4 },
    DEFAULT_CROP,
    REFERENCE_SETTINGS,
  );
  const positions = geometry.getAttribute("position").array;
  const index = geometry.getIndex().array;
  const hash = crypto
    .createHash("sha256")
    .update(
      Buffer.from(positions.buffer, positions.byteOffset, positions.byteLength),
    )
    .update(Buffer.from(index.buffer, index.byteOffset, index.byteLength))
    .digest("hex");
  assert.equal(
    hash,
    "9e3c7d064c35f599d5b129adb4887d1419c7f7d2c3e960ec692d80b0c5e642b7",
  );
  geometry.dispose();
});
