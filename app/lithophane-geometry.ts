import * as THREE from "three";

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

function addBox(
  positions: number[],
  indices: number[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  minZ: number,
  maxZ: number,
) {
  const start = positions.length / 3;
  positions.push(
    minX,
    minY,
    minZ,
    maxX,
    minY,
    minZ,
    maxX,
    maxY,
    minZ,
    minX,
    maxY,
    minZ,
    minX,
    minY,
    maxZ,
    maxX,
    minY,
    maxZ,
    maxX,
    maxY,
    maxZ,
    minX,
    maxY,
    maxZ,
  );

  const faces = [
    0, 2, 1, 0, 3, 2,
    4, 5, 6, 4, 6, 7,
    0, 1, 5, 0, 5, 4,
    1, 2, 6, 1, 6, 5,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
  ];
  indices.push(...faces.map((index) => index + start));
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
  const rows = Math.max(
    24,
    Math.min(preview ? 90 : 520, Math.round(settings.height / effectiveResolution)),
  );
  const angle = 2 * Math.asin(Math.min(0.98, settings.width / (2 * settings.radius)));
  const positions: number[] = [];
  const indices: number[] = [];
  const stride = columns + 1;
  const layerSize = stride * (rows + 1);
  const aspectRatio = settings.width / settings.height;

  for (let layer = 0; layer < 2; layer += 1) {
    for (let row = 0; row <= rows; row += 1) {
      const v = 1 - row / rows;
      const z = (row / rows) * settings.height;
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
          settings.radius + (layer === 0 ? relief : 0);

        positions.push(
          Math.sin(theta) * radialDistance,
          Math.cos(theta) * radialDistance,
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
    const bottomA = column;
    const bottomB = column + 1;
    const bottomBackA = bottomA + layerSize;
    const bottomBackB = bottomB + layerSize;
    indices.push(
      bottomA,
      bottomBackB,
      bottomB,
      bottomA,
      bottomBackA,
      bottomBackB,
    );

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

  const wall = settings.adapterThickness;
  const halfSlot = settings.slotWidth / 2;
  const adapterHeight = Math.min(18, settings.height * 0.18);
  const slotStartY = Math.max(4, settings.radius - settings.lightDistance);
  const slotEndY = Math.min(
    settings.radius - wall,
    slotStartY + settings.slotDepth,
  );
  const adapterBottom = -adapterHeight;
  const adapterTop = Math.max(0.8, settings.minThickness);

  addBox(
    positions,
    indices,
    -halfSlot - wall,
    -halfSlot,
    slotStartY,
    slotEndY,
    adapterBottom,
    adapterTop,
  );
  addBox(
    positions,
    indices,
    halfSlot,
    halfSlot + wall,
    slotStartY,
    slotEndY,
    adapterBottom,
    adapterTop,
  );
  addBox(
    positions,
    indices,
    -halfSlot - wall,
    halfSlot + wall,
    slotEndY - wall,
    slotEndY,
    adapterBottom,
    adapterTop,
  );
  addBox(
    positions,
    indices,
    -halfSlot - wall,
    halfSlot + wall,
    slotEndY - wall,
    settings.radius + settings.minThickness,
    -wall,
    adapterTop,
  );

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.center();
  return geometry;
}

export function estimateTriangleCount(settings: LithophaneSettings) {
  const columns = Math.max(
    24,
    Math.min(520, Math.round(settings.width / settings.resolution)),
  );
  const rows = Math.max(
    24,
    Math.min(520, Math.round(settings.height / settings.resolution)),
  );
  return columns * rows * 4 + columns * 4 + rows * 4 + 48;
}

