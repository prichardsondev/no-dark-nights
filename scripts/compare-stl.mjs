import fs from "node:fs";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const [referencePath, candidatePath] = process.argv.slice(2);
if (!referencePath || !candidatePath) {
  throw new Error(
    "Usage: node scripts/compare-stl.mjs reference.stl candidate.stl",
  );
}

const load = (filename) => {
  const raw = fs.readFileSync(filename);
  const geometry = new STLLoader().parse(
    raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength),
  );
  geometry.computeBoundingBox();
  return { filename, raw, geometry, position: geometry.getAttribute("position") };
};

const reference = load(referencePath);
const candidate = load(candidatePath);
const quantize = (value) => Math.round(value * 10000);
const edgeKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);

function analyze(model) {
  const vertices = new Map();
  const edges = new Map();
  let surfaceArea = 0;
  let signedVolume = 0;

  const vertex = (index) => ({
    x: model.position.getX(index),
    y: model.position.getY(index),
    z: model.position.getZ(index),
  });
  const vertexId = (point) => {
    const key = `${quantize(point.x)},${quantize(point.y)},${quantize(point.z)}`;
    if (!vertices.has(key)) vertices.set(key, vertices.size);
    return vertices.get(key);
  };

  for (let offset = 0; offset < model.position.count; offset += 3) {
    const points = [vertex(offset), vertex(offset + 1), vertex(offset + 2)];
    const ab = {
      x: points[1].x - points[0].x,
      y: points[1].y - points[0].y,
      z: points[1].z - points[0].z,
    };
    const ac = {
      x: points[2].x - points[0].x,
      y: points[2].y - points[0].y,
      z: points[2].z - points[0].z,
    };
    const cross = {
      x: ab.y * ac.z - ab.z * ac.y,
      y: ab.z * ac.x - ab.x * ac.z,
      z: ab.x * ac.y - ab.y * ac.x,
    };
    surfaceArea += Math.hypot(cross.x, cross.y, cross.z) / 2;
    signedVolume += (
      points[0].x * (points[1].y * points[2].z - points[1].z * points[2].y) -
      points[0].y * (points[1].x * points[2].z - points[1].z * points[2].x) +
      points[0].z * (points[1].x * points[2].y - points[1].y * points[2].x)
    ) / 6;

    const ids = points.map(vertexId);
    for (const [start, end] of [[0, 1], [1, 2], [2, 0]]) {
      const a = ids[start];
      const b = ids[end];
      const key = edgeKey(a, b);
      const edge = edges.get(key) ?? { count: 0, direction: 0 };
      edge.count += 1;
      edge.direction += a < b ? 1 : -1;
      edges.set(key, edge);
    }
  }

  const edgeValues = [...edges.values()];
  return {
    bytes: model.raw.length,
    triangles: model.position.count / 3,
    uniqueVertices: vertices.size,
    bounds: {
      min: model.geometry.boundingBox.min.toArray(),
      max: model.geometry.boundingBox.max.toArray(),
    },
    surfaceArea,
    signedVolume,
    absoluteVolume: Math.abs(signedVolume),
    openEdges: edgeValues.filter(({ count }) => count === 1).length,
    nonManifoldEdges: edgeValues.filter(({ count }) => count > 2).length,
    windingMismatchEdges: edgeValues.filter(
      ({ count, direction }) => count === 2 && direction !== 0,
    ).length,
  };
}

function reliefGrid(model, horizontalFlip = false) {
  const columns = 120;
  const rows = 110;
  const grid = new Float64Array(columns * rows);
  grid.fill(Number.NaN);
  const radius = 80;
  const centerY = 17 + 30 - radius;
  const frame = 7.5;
  const imageHeight = 105 - frame * 2;
  const angle = 2 * Math.asin(103.73 / (2 * radius));
  const innerRadius = radius - 2.8;

  for (let index = 0; index < model.position.count; index += 1) {
    const x = model.position.getX(index);
    const y = model.position.getY(index);
    const z = model.position.getZ(index);
    if (z <= frame + 1 || z >= 105 - frame - 1) continue;
    const radial = Math.hypot(x, y - centerY);
    if (radial <= innerRadius + 0.15) continue;
    const theta = Math.atan2(x, y - centerY);
    let u = theta / angle + 0.5;
    if (horizontalFlip) u = 1 - u;
    const v = (z - frame) / imageHeight;
    if (u <= 0.08 || u >= 0.92 || v <= 0.03 || v >= 0.97) continue;
    const column = Math.max(0, Math.min(columns - 1, Math.round(u * (columns - 1))));
    const row = Math.max(0, Math.min(rows - 1, Math.round(v * (rows - 1))));
    const offset = row * columns + column;
    if (Number.isNaN(grid[offset]) || radial > grid[offset]) {
      grid[offset] = radial;
    }
  }
  return grid;
}

function reliefDifference(referenceGrid, candidateGrid) {
  const pairs = [];
  for (let index = 0; index < referenceGrid.length; index += 1) {
    if (!Number.isNaN(referenceGrid[index]) && !Number.isNaN(candidateGrid[index])) {
      pairs.push([referenceGrid[index], candidateGrid[index]]);
    }
  }
  const meanA = pairs.reduce((sum, pair) => sum + pair[0], 0) / pairs.length;
  const meanB = pairs.reduce((sum, pair) => sum + pair[1], 0) / pairs.length;
  let covariance = 0;
  let varianceA = 0;
  let varianceB = 0;
  let squaredError = 0;
  let absoluteError = 0;
  for (const [a, b] of pairs) {
    covariance += (a - meanA) * (b - meanB);
    varianceA += (a - meanA) ** 2;
    varianceB += (b - meanB) ** 2;
    squaredError += (b - a) ** 2;
    absoluteError += Math.abs(b - a);
  }
  return {
    samples: pairs.length,
    correlation: covariance / Math.sqrt(varianceA * varianceB),
    meanAbsoluteDifference: absoluteError / pairs.length,
    rootMeanSquareDifference: Math.sqrt(squaredError / pairs.length),
  };
}

const referenceAnalysis = analyze(reference);
const candidateAnalysis = analyze(candidate);
const referenceRelief = reliefGrid(reference);
const directRelief = reliefDifference(referenceRelief, reliefGrid(candidate));
const flippedRelief = reliefDifference(
  referenceRelief,
  reliefGrid(candidate, true),
);

console.log(JSON.stringify({
  reference: referenceAnalysis,
  candidate: candidateAnalysis,
  deltas: {
    width:
      candidateAnalysis.bounds.max[0] - candidateAnalysis.bounds.min[0] -
      (referenceAnalysis.bounds.max[0] - referenceAnalysis.bounds.min[0]),
    depth:
      candidateAnalysis.bounds.max[1] - candidateAnalysis.bounds.min[1] -
      (referenceAnalysis.bounds.max[1] - referenceAnalysis.bounds.min[1]),
    height:
      candidateAnalysis.bounds.max[2] - candidateAnalysis.bounds.min[2] -
      (referenceAnalysis.bounds.max[2] - referenceAnalysis.bounds.min[2]),
    surfaceAreaPercent:
      (candidateAnalysis.surfaceArea / referenceAnalysis.surfaceArea - 1) * 100,
    volumePercent:
      (candidateAnalysis.absoluteVolume / referenceAnalysis.absoluteVolume - 1) * 100,
  },
  relief: {
    direct: directRelief,
    horizontallyFlipped: flippedRelief,
  },
}, null, 2));

reference.geometry.dispose();
candidate.geometry.dispose();
