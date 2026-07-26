import fs from "node:fs";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const filename = process.argv[2];
const levels = (process.argv[3] ?? "0.5,5,10,16.5,18.5,25,50,104.5")
  .split(",")
  .map(Number);

if (!filename) {
  throw new Error("Pass an STL file path.");
}

const raw = fs.readFileSync(filename);
const geometry = new STLLoader().parse(
  raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength),
);
geometry.computeBoundingBox();
const position = geometry.getAttribute("position");
const bounds = geometry.boundingBox;

console.log(
  JSON.stringify(
    {
      bytes: raw.length,
      triangles: position.count / 3,
      bounds: {
        min: bounds.min.toArray(),
        max: bounds.max.toArray(),
      },
    },
    null,
    2,
  ),
);

function vertex(index) {
  return {
    x: position.getX(index),
    y: position.getY(index),
    z: position.getZ(index),
  };
}

function intersection(a, b, level) {
  const aDistance = a.z - level;
  const bDistance = b.z - level;
  if (Math.abs(aDistance) < 1e-6 && Math.abs(bDistance) < 1e-6) {
    return null;
  }
  if (aDistance * bDistance > 0) {
    return null;
  }
  const denominator = b.z - a.z;
  if (Math.abs(denominator) < 1e-9) {
    return null;
  }
  const amount = (level - a.z) / denominator;
  if (amount < -1e-6 || amount > 1 + 1e-6) {
    return null;
  }
  return {
    x: a.x + (b.x - a.x) * amount,
    y: a.y + (b.y - a.y) * amount,
  };
}

function section(level) {
  const segments = [];
  for (let triangle = 0; triangle < position.count; triangle += 3) {
    const vertices = [
      vertex(triangle),
      vertex(triangle + 1),
      vertex(triangle + 2),
    ];
    const points = [];
    for (const [start, end] of [
      [0, 1],
      [1, 2],
      [2, 0],
    ]) {
      const point = intersection(vertices[start], vertices[end], level);
      if (
        point &&
        !points.some(
          (candidate) =>
            Math.abs(candidate.x - point.x) < 1e-5 &&
            Math.abs(candidate.y - point.y) < 1e-5,
        )
      ) {
        points.push(point);
      }
    }
    if (points.length === 2) {
      segments.push(points);
    }
  }
  return segments;
}

function render(level, segments) {
  const columns = 90;
  const rows = 40;
  const minX = bounds.min.x - 2;
  const maxX = bounds.max.x + 2;
  const minY = bounds.min.y - 2;
  const maxY = bounds.max.y + 2;
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => " "),
  );

  const plot = (x, y) => {
    const column = Math.round(((x - minX) / (maxX - minX)) * (columns - 1));
    const row = Math.round(((maxY - y) / (maxY - minY)) * (rows - 1));
    if (row >= 0 && row < rows && column >= 0 && column < columns) {
      grid[row][column] = "#";
    }
  };

  for (const [start, end] of segments) {
    const steps = Math.max(
      2,
      Math.ceil(Math.hypot(end.x - start.x, end.y - start.y) * 3),
    );
    for (let step = 0; step <= steps; step += 1) {
      const amount = step / steps;
      plot(
        start.x + (end.x - start.x) * amount,
        start.y + (end.y - start.y) * amount,
      );
    }
  }

  const points = segments.flat();
  const summary = {
    level,
    segments: segments.length,
    x: [
      Math.min(...points.map((point) => point.x)),
      Math.max(...points.map((point) => point.x)),
    ],
    y: [
      Math.min(...points.map((point) => point.y)),
      Math.max(...points.map((point) => point.y)),
    ],
  };
  console.log(`\nZ=${level} ${JSON.stringify(summary)}`);
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function distanceToLine(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const denominator = dx * dx + dy * dy;
  if (denominator === 0) {
    return Math.hypot(point.x - start.x, point.y - start.y);
  }
  const amount = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) / denominator,
    ),
  );
  return Math.hypot(
    point.x - (start.x + amount * dx),
    point.y - (start.y + amount * dy),
  );
}

function simplify(points, tolerance) {
  if (points.length <= 2) return points;
  let maximum = 0;
  let split = 0;
  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = distanceToLine(
      points[index],
      points[0],
      points[points.length - 1],
    );
    if (distance > maximum) {
      maximum = distance;
      split = index;
    }
  }
  if (maximum <= tolerance) {
    return [points[0], points[points.length - 1]];
  }
  return [
    ...simplify(points.slice(0, split + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(split), tolerance),
  ];
}

function traceLoops(segments) {
  const scale = 1000;
  const key = (point) =>
    `${Math.round(point.x * scale)},${Math.round(point.y * scale)}`;
  const adjacency = new Map();
  const pointsByKey = new Map();

  segments.forEach((segment, segmentIndex) => {
    segment.forEach((point) => {
      const pointKey = key(point);
      pointsByKey.set(pointKey, point);
      const connected = adjacency.get(pointKey) ?? [];
      connected.push(segmentIndex);
      adjacency.set(pointKey, connected);
    });
  });

  const unused = new Set(segments.map((_, index) => index));
  const loops = [];
  while (unused.size) {
    const startSegment = unused.values().next().value;
    unused.delete(startSegment);
    const startKey = key(segments[startSegment][0]);
    let currentKey = key(segments[startSegment][1]);
    let previousSegment = startSegment;
    const loop = [pointsByKey.get(startKey), pointsByKey.get(currentKey)];
    let guard = 0;

    while (currentKey !== startKey && guard < segments.length + 10) {
      const candidates = (adjacency.get(currentKey) ?? []).filter(
        (candidate) => candidate !== previousSegment && unused.has(candidate),
      );
      if (!candidates.length) break;
      const nextSegment = candidates[0];
      unused.delete(nextSegment);
      const [first, second] = segments[nextSegment];
      const nextKey = key(first) === currentKey ? key(second) : key(first);
      loop.push(pointsByKey.get(nextKey));
      currentKey = nextKey;
      previousSegment = nextSegment;
      guard += 1;
    }
    loops.push(loop.filter(Boolean));
  }
  return loops.sort((a, b) => b.length - a.length);
}

for (const level of levels) {
  const segments = section(level);
  render(level, segments);
  if (level < 2) {
    const loops = traceLoops(segments);
    console.log(
      "\nSimplified section loops:",
      JSON.stringify(
        loops.slice(0, 6).map((loop) => ({
          vertices: loop.length,
          closed:
            Math.hypot(
              loop[0].x - loop[loop.length - 1].x,
              loop[0].y - loop[loop.length - 1].y,
            ) < 0.01,
          points: simplify(loop, 0.35).map((point) => [
            Number(point.x.toFixed(3)),
            Number(point.y.toFixed(3)),
          ]),
        })),
        null,
        2,
      ),
    );
  }
}
