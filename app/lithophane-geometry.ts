import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  createAdapterSlotProfile,
  type Point2,
} from "./adapter-slot-profile.ts";

export type LithophaneSettings = {
  width: number;
  height: number;
  radius: number;
  minThickness: number;
  maxThickness: number;
  frameWidth: number;
  resolution: number;
  slotWidth: number;
  slotDepth: number;
  adapterThickness: number;
  lightDistance: number;
  contrast: number;
  invert: boolean;
};

export type CropSettings = {
  enabled: boolean;
  zoom: number;
  positionX: number;
  positionY: number;
};

export type SourceImage = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

export const REFERENCE_SETTINGS: LithophaneSettings = {
  width: 103.73,
  height: 105,
  radius: 80,
  minThickness: 0.6,
  maxThickness: 2.8,
  frameWidth: 7.5,
  resolution: 0.25,
  slotWidth: 16.5,
  slotDepth: 17,
  adapterThickness: 3.25,
  lightDistance: 30,
  contrast: 1,
  invert: false,
};

export const DEFAULT_SETTINGS = REFERENCE_SETTINGS;

export const DEFAULT_CROP: CropSettings = {
  enabled: false,
  zoom: 1,
  positionX: 0.5,
  positionY: 0.5,
};

export function calculateUncroppedWidth(
  sourceAspectRatio: number,
  settings: Pick<LithophaneSettings, "height" | "frameWidth" | "radius">,
) {
  const imageHeight = Math.max(0.1, settings.height - settings.frameWidth * 2);
  const imageArcLength = imageHeight * sourceAspectRatio;
  const totalArcLength = imageArcLength + settings.frameWidth * 2;
  const minimumWidth = Math.min(40, settings.radius * 0.75);
  const minimumAngle = 2 * Math.asin(minimumWidth / (2 * settings.radius));
  // Leave a little clearance below the generator's 1.96 × radius limit so
  // very wide photos never land on an invalid floating-point boundary.
  const maximumAngle = 2 * Math.asin(0.97);
  const angle = Math.min(
    maximumAngle,
    Math.max(minimumAngle, totalArcLength / settings.radius),
  );
  return 2 * settings.radius * Math.sin(angle / 2);
}

function sampleSource(
  source: SourceImage,
  u: number,
  v: number,
  aspectRatio: number,
  crop: CropSettings,
) {
  if (!crop.enabled) {
    const sourceAspect = source.width / source.height;
    let sourceU = u;
    let sourceV = v;
    if (sourceAspect > aspectRatio) {
      const contentHeight = aspectRatio / sourceAspect;
      const offset = (1 - contentHeight) / 2;
      if (v < offset || v > offset + contentHeight) return 1;
      sourceV = (v - offset) / contentHeight;
    } else if (sourceAspect < aspectRatio) {
      const contentWidth = sourceAspect / aspectRatio;
      const offset = (1 - contentWidth) / 2;
      if (u < offset || u > offset + contentWidth) return 1;
      sourceU = (u - offset) / contentWidth;
    }
    const x = Math.min(
      source.width - 1,
      Math.max(0, Math.round(sourceU * (source.width - 1))),
    );
    const y = Math.min(
      source.height - 1,
      Math.max(0, Math.round(sourceV * (source.height - 1))),
    );
    const index = (y * source.width + x) * 4;
    return (
      (source.data[index] * 0.2126 +
        source.data[index + 1] * 0.7152 +
        source.data[index + 2] * 0.0722) /
      255
    );
  }

  const sourceAspect = source.width / source.height;
  let baseWidth: number;
  let baseHeight: number;

  if (sourceAspect > aspectRatio) {
    baseHeight = source.height;
    baseWidth = baseHeight * aspectRatio;
  } else {
    baseWidth = source.width;
    baseHeight = baseWidth / aspectRatio;
  }

  const cropWidth = baseWidth / crop.zoom;
  const cropHeight = baseHeight / crop.zoom;
  const maxOffsetX = source.width - cropWidth;
  const maxOffsetY = source.height - cropHeight;
  const x = Math.min(
    source.width - 1,
    Math.max(0, maxOffsetX * crop.positionX + u * cropWidth),
  );
  const y = Math.min(
    source.height - 1,
    Math.max(0, maxOffsetY * crop.positionY + v * cropHeight),
  );

  const index = (Math.floor(y) * source.width + Math.floor(x)) * 4;
  const red = source.data[index] / 255;
  const green = source.data[index + 1] / 255;
  const blue = source.data[index + 2] / 255;
  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

function adjustedLuminance(
  luminance: number,
  contrast: number,
  invert: boolean,
) {
  const contrasted = Math.min(
    1,
    Math.max(0, (luminance - 0.5) * contrast + 0.5),
  );
  return invert ? 1 - contrasted : contrasted;
}

function addPolygonFace(
  positions: number[],
  indices: number[],
  polygon: Point2[],
  z: number,
  reverse: boolean,
) {
  const start = positions.length / 3;
  for (const point of polygon) {
    positions.push(point.x, point.y, z);
  }
  const faces = THREE.ShapeUtils.triangulateShape(
    polygon.map((point) => new THREE.Vector2(point.x, point.y)),
    [],
  );
  for (const [a, b, c] of faces) {
    indices.push(
      start + (reverse ? c : a),
      start + b,
      start + (reverse ? a : c),
    );
  }
}

function addPolygonWalls(
  positions: number[],
  indices: number[],
  polygon: Point2[],
  bottom: number,
  top: number,
) {
  for (let index = 0; index < polygon.length; index += 1) {
    const next = (index + 1) % polygon.length;
    const start = positions.length / 3;
    positions.push(
      polygon[index].x,
      polygon[index].y,
      bottom,
      polygon[next].x,
      polygon[next].y,
      bottom,
      polygon[next].x,
      polygon[next].y,
      top,
      polygon[index].x,
      polygon[index].y,
      top,
    );
    indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
  }
}

export function createLithophaneGeometry(
  source: SourceImage,
  crop: CropSettings,
  settings: LithophaneSettings,
  preview = false,
) {
  const effectiveResolution = preview
    ? Math.max(0.65, settings.resolution)
    : settings.resolution;
  const angle =
    2 * Math.asin(Math.min(0.999999, settings.width / (2 * settings.radius)));
  const totalArcLength = angle * settings.radius;
  const columns = Math.max(
    24,
    Math.min(
      preview ? 200 : 640,
      Math.round(totalArcLength / effectiveResolution),
    ),
  );
  const panelHeight = settings.height - settings.adapterThickness;
  const rows = Math.max(
    24,
    Math.min(
      preview ? 200 : 640,
      Math.round(panelHeight / effectiveResolution),
    ),
  );
  const positions: number[] = [];
  const indices: number[] = [];
  const stride = columns + 1;
  const imageArcLength = Math.max(
    0.1,
    totalArcLength - settings.frameWidth * 2,
  );
  const imageHeight = Math.max(0.1, settings.height - settings.frameWidth * 2);
  const aspectRatio = imageArcLength / imageHeight;
  const circleCenterY =
    settings.slotDepth + settings.lightDistance - settings.radius;
  const innerRadius = settings.radius - settings.maxThickness;

  // Lithofun's proven topology uses a sampled relief surface, a smooth
  // reference surface, and sealed perimeter walls. The smooth inner face can
  // be represented as a curved strip, avoiding hundreds of thousands of
  // redundant coplanar triangles in high-detail exports.
  for (let row = 0; row <= rows; row += 1) {
    const z = settings.adapterThickness + (row / rows) * panelHeight;
    const imageV = 1 - (z - settings.frameWidth) / imageHeight;
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns;
      const arcPosition = u * totalArcLength;
      const imageU = (arcPosition - settings.frameWidth) / imageArcLength;
      const theta = (u - 0.5) * angle;
      const inFrame =
        arcPosition <= settings.frameWidth ||
        arcPosition >= totalArcLength - settings.frameWidth ||
        z <= settings.frameWidth ||
        z >= settings.height - settings.frameWidth;
      const lightness = adjustedLuminance(
        sampleSource(
          source,
          1 - Math.min(1, Math.max(0, imageU)),
          Math.min(1, Math.max(0, imageV)),
          aspectRatio,
          crop,
        ),
        settings.contrast,
        settings.invert,
      );
      const relief = inFrame
        ? settings.maxThickness
        : settings.minThickness +
          (1 - lightness) * (settings.maxThickness - settings.minThickness);
      const radialDistance = innerRadius + relief;

      positions.push(
        Math.sin(theta) * radialDistance,
        circleCenterY + Math.cos(theta) * radialDistance,
        z,
      );
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * stride + column;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  const smoothBottom: number[] = [];
  const smoothTop: number[] = [];
  for (let column = 0; column <= columns; column += 1) {
    const theta = (column / columns - 0.5) * angle;
    smoothBottom.push(positions.length / 3);
    positions.push(
      Math.sin(theta) * innerRadius,
      circleCenterY + Math.cos(theta) * innerRadius,
      settings.adapterThickness,
    );
    smoothTop.push(positions.length / 3);
    positions.push(
      Math.sin(theta) * innerRadius,
      circleCenterY + Math.cos(theta) * innerRadius,
      settings.height,
    );
  }

  for (let column = 0; column < columns; column += 1) {
    const smoothA = smoothBottom[column];
    const smoothB = smoothBottom[column + 1];
    const smoothC = smoothTop[column];
    const smoothD = smoothTop[column + 1];
    indices.push(smoothA, smoothD, smoothB, smoothA, smoothC, smoothD);

    const innerTopA = rows * stride + column;
    const innerTopB = innerTopA + 1;
    indices.push(smoothC, innerTopA, innerTopB, smoothC, innerTopB, smoothD);
  }

  for (let row = 0; row < rows; row += 1) {
    const leftA = row * stride;
    const leftB = leftA + stride;
    indices.push(smoothBottom[0], leftA, leftB);

    const rightA = row * stride + columns;
    const rightB = rightA + stride;
    indices.push(smoothBottom[columns], rightB, rightA);
  }
  indices.push(
    smoothBottom[0],
    rows * stride,
    smoothTop[0],
    smoothBottom[columns],
    smoothTop[columns],
    rows * stride + columns,
  );

  const slotSegments = preview ? 14 : 30;
  const {
    boundary: slotBoundary,
    leftLip,
    rightLip,
  } = createAdapterSlotProfile({
    slotWidth: settings.slotWidth,
    slotDepth: settings.slotDepth,
    segments: slotSegments,
  });

  const arcPoint = (column: number, radius: number): Point2 => {
    const u = column / columns;
    const theta = (u - 0.5) * angle;
    return {
      x: Math.sin(theta) * radius,
      y: circleCenterY + Math.cos(theta) * radius,
    };
  };

  const outerRight = arcPoint(columns, settings.radius);
  const innerRight = arcPoint(columns, innerRadius);
  const innerLeft = arcPoint(0, innerRadius);
  const fullBase: Point2[] = [
    ...slotBoundary,
    rightLip,
    innerRight,
    outerRight,
  ];
  for (let column = columns - 1; column >= 0; column -= 1) {
    fullBase.push(arcPoint(column, settings.radius));
  }
  fullBase.push(innerLeft, leftLip);

  const topBase: Point2[] = [...slotBoundary, rightLip, innerRight];
  for (let column = columns - 1; column >= 0; column -= 1) {
    topBase.push(arcPoint(column, innerRadius));
  }
  topBase.push(leftLip);

  const baseIndexStart = indices.length;
  addPolygonFace(positions, indices, fullBase, 0, true);
  addPolygonFace(positions, indices, topBase, settings.adapterThickness, false);
  addPolygonWalls(positions, indices, fullBase, 0, settings.adapterThickness);
  for (let offset = baseIndexStart; offset < indices.length; offset += 3) {
    const second = indices[offset + 1];
    indices[offset + 1] = indices[offset + 2];
    indices[offset + 2] = second;
  }
  // Export outward-facing normals, matching the reference STL and avoiding
  // slicer-side face repair.
  for (let offset = 0; offset < indices.length; offset += 3) {
    const second = indices[offset + 1];
    indices[offset + 1] = indices[offset + 2];
    indices[offset + 2] = second;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  const welded = mergeVertices(geometry, 1e-4);
  geometry.dispose();
  welded.computeVertexNormals();
  welded.computeBoundingBox();
  return welded;
}

export function estimateTriangleCount(settings: LithophaneSettings) {
  const angle =
    2 * Math.asin(Math.min(0.999999, settings.width / (2 * settings.radius)));
  const totalArcLength = angle * settings.radius;
  const columns = Math.max(
    24,
    Math.min(640, Math.round(totalArcLength / settings.resolution)),
  );
  const rows = Math.max(
    24,
    Math.min(
      640,
      Math.round(
        (settings.height - settings.adapterThickness) / settings.resolution,
      ),
    ),
  );
  return columns * rows * 2 + columns * 6 + rows * 4 + 220;
}
