import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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
  zoom: number;
  positionX: number;
  positionY: number;
};

export type SourceImage = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

export const DEFAULT_SETTINGS: LithophaneSettings = {
  width: 120,
  height: 105,
  radius: 80,
  minThickness: 0.6,
  maxThickness: 2.8,
  frameWidth: 7.5,
  resolution: 0.5,
  slotWidth: 17,
  slotDepth: 17,
  adapterThickness: 1.8,
  lightDistance: 30,
  contrast: 1.08,
  invert: false,
};

export const DEFAULT_CROP: CropSettings = {
  zoom: 1,
  positionX: 0.5,
  positionY: 0.5,
};

function sampleSource(
  source: SourceImage,
  u: number,
  v: number,
  aspectRatio: number,
  crop: CropSettings,
) {
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

type Point2 = {
  x: number;
  y: number;
};

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
    indices.push(
      start,
      start + 1,
      start + 2,
      start,
      start + 2,
      start + 3,
    );
  }
}

export function createLithophaneGeometry(
  source: SourceImage,
  crop: CropSettings,
  settings: LithophaneSettings,
  preview = false,
) {
  const effectiveResolution = preview
    ? Math.max(2, settings.resolution)
    : settings.resolution;
  const columns = Math.max(
    24,
    Math.min(preview ? 90 : 520, Math.round(settings.width / effectiveResolution)),
  );
  const panelHeight = settings.height - settings.adapterThickness;
  const rows = Math.max(
    24,
    Math.min(preview ? 90 : 520, Math.round(panelHeight / effectiveResolution)),
  );
  const angle = 2 * Math.asin(Math.min(0.98, settings.width / (2 * settings.radius)));
  const positions: number[] = [];
  const indices: number[] = [];
  const stride = columns + 1;
  const layerSize = stride * (rows + 1);
  const aspectRatio = settings.width / settings.height;
  const circleCenterY =
    settings.slotDepth + settings.lightDistance - settings.radius;

  for (let layer = 0; layer < 2; layer += 1) {
    for (let row = 0; row <= rows; row += 1) {
      const z =
        settings.adapterThickness + (row / rows) * panelHeight;
      const v = 1 - z / settings.height;
      for (let column = 0; column <= columns; column += 1) {
        const u = column / columns;
        const theta = (u - 0.5) * angle;
        const edgeDistance = Math.min(
          u * settings.width,
          (1 - u) * settings.width,
          v * settings.height,
          (1 - v) * settings.height,
        );
        const lightness = adjustedLuminance(
          sampleSource(source, u, v, aspectRatio, crop),
          settings.contrast,
          settings.invert,
        );
        const relief =
          edgeDistance <= settings.frameWidth
            ? settings.maxThickness
            : settings.minThickness +
              (1 - lightness) *
                (settings.maxThickness - settings.minThickness);
        const radialDistance =
          settings.radius - (layer === 1 ? relief : 0);

        positions.push(
          Math.sin(theta) * radialDistance,
          circleCenterY + Math.cos(theta) * radialDistance,
          z,
        );
      }
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const a = row * stride + column;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);

      const backA = a + layerSize;
      const backB = b + layerSize;
      const backC = c + layerSize;
      const backD = d + layerSize;
      indices.push(backA, backD, backB, backA, backC, backD);
    }
  }

  for (let column = 0; column < columns; column += 1) {
    const topA = rows * stride + column;
    const topB = topA + 1;
    const topBackA = topA + layerSize;
    const topBackB = topB + layerSize;
    indices.push(topA, topB, topBackB, topA, topBackB, topBackA);
  }

  for (let row = 0; row < rows; row += 1) {
    const leftA = row * stride;
    const leftB = leftA + stride;
    const leftBackA = leftA + layerSize;
    const leftBackB = leftB + layerSize;
    indices.push(leftA, leftB, leftBackB, leftA, leftBackB, leftBackA);

    const rightA = row * stride + columns;
    const rightB = rightA + stride;
    const rightBackA = rightA + layerSize;
    const rightBackB = rightB + layerSize;
    indices.push(
      rightA,
      rightBackB,
      rightB,
      rightA,
      rightBackA,
      rightBackB,
    );
  }

  const snugFitAllowance = 0.5;
  const halfSlot = Math.max(2, (settings.slotWidth - snugFitAllowance) / 2);
  const lipWidth = 5;
  const slotSegments = preview ? 14 : 30;
  const slotBoundary: Point2[] = [{ x: -halfSlot, y: 0 }];
  for (let segment = 0; segment <= slotSegments; segment += 1) {
    const slotAngle = Math.PI - (segment / slotSegments) * Math.PI;
    slotBoundary.push({
      x: Math.cos(slotAngle) * halfSlot,
      y: settings.slotDepth + Math.sin(slotAngle) * halfSlot,
    });
  }
  slotBoundary.push({ x: halfSlot, y: 0 });

  const arcPoint = (column: number, radius: number): Point2 => {
    const u = column / columns;
    const theta = (u - 0.5) * angle;
    return {
      x: Math.sin(theta) * radius,
      y: circleCenterY + Math.cos(theta) * radius,
    };
  };

  const outerRight = arcPoint(columns, settings.radius);
  const innerRadius = settings.radius - settings.maxThickness;
  const innerRight = arcPoint(columns, innerRadius);
  const innerLeft = arcPoint(0, innerRadius);
  const rightLip = { x: halfSlot + lipWidth, y: 0 };
  const leftLip = { x: -halfSlot - lipWidth, y: 0 };

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

  addPolygonFace(positions, indices, fullBase, 0, true);
  addPolygonFace(
    positions,
    indices,
    topBase,
    settings.adapterThickness,
    false,
  );
  addPolygonWalls(
    positions,
    indices,
    fullBase,
    0,
    settings.adapterThickness,
  );

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
  welded.center();
  return welded;
}

export function estimateTriangleCount(settings: LithophaneSettings) {
  const columns = Math.max(
    24,
    Math.min(520, Math.round(settings.width / settings.resolution)),
  );
  const rows = Math.max(
    24,
    Math.min(
      520,
      Math.round(
        (settings.height - settings.adapterThickness) / settings.resolution,
      ),
    ),
  );
  return columns * rows * 4 + columns * 8 + rows * 4 + 220;
}
