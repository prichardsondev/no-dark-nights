import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  SLOT_WIDTH_MAX,
  SLOT_WIDTH_MIN,
  createAdapterSlotProfile,
  type Point2,
} from "./adapter-slot-profile.ts";
import {
  REFERENCE_SETTINGS,
  type LithophaneSettings,
} from "./lithophane-geometry.ts";
import { createFlatLabelGeometry } from "./lithophane-label.ts";

export const FIT_FINDER_DEFAULT_CENTER = 16.5;
export const FIT_FINDER_DEFAULT_SPACING = 0.5;
export const FIT_FINDER_SPACING_OPTIONS = [0.5, 0.25] as const;
export const FIT_FINDER_BUILD_PLATE = 180;
export const FIT_COUPON_GAP = 8;
export const FIT_COUPON_REAR_MARGIN = 14;
export const FIT_COUPON_OUTER_MARGIN = 4;
export const FIT_LABEL_RAISE = 0.6;

export type FitFinderSpacing = (typeof FIT_FINDER_SPACING_OPTIONS)[number];

export type NormalizedFitFinder = {
  center: number;
  spacing: FitFinderSpacing;
  widths: [number, number, number];
  correction: string | null;
};

export type FitFinderPart = {
  slotWidth: number;
  label: string;
  baseGeometry: THREE.BufferGeometry;
  labelGeometry: THREE.BufferGeometry;
};

function roundHundredth(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatSlotWidth(value: number) {
  return Number.isInteger(value * 10) ? value.toFixed(1) : value.toFixed(2);
}

export function normalizeFitFinder(
  requestedCenter: number,
  requestedSpacing: number,
): NormalizedFitFinder {
  const spacing: FitFinderSpacing =
    requestedSpacing === 0.25 ? 0.25 : FIT_FINDER_DEFAULT_SPACING;
  const minimumCenter = SLOT_WIDTH_MIN + spacing;
  const maximumCenter = SLOT_WIDTH_MAX - spacing;
  let center = requestedCenter;
  let correction: string | null = null;

  if (!Number.isFinite(center)) {
    center = FIT_FINDER_DEFAULT_CENTER;
    correction = `Enter a number from ${minimumCenter} to ${maximumCenter} mm. We restored the 16.5 mm starting point.`;
  } else if (center < minimumCenter || center > maximumCenter) {
    center = Math.min(maximumCenter, Math.max(minimumCenter, center));
    correction = `The three tests must stay between ${SLOT_WIDTH_MIN} and ${SLOT_WIDTH_MAX} mm. The center was adjusted to ${formatSlotWidth(center)} mm.`;
  }

  center = roundHundredth(center);
  const widths = [
    roundHundredth(center - spacing),
    center,
    roundHundredth(center + spacing),
  ] as [number, number, number];

  return { center, spacing, widths, correction };
}

export function withFitFinderSlotWidth<T extends { slotWidth: number }>(
  settings: T,
  slotWidth: number,
): T {
  return { ...settings, slotWidth };
}

function addPolygonFace(
  positions: number[],
  indices: number[],
  polygon: Point2[],
  z: number,
  reverse: boolean,
) {
  const start = positions.length / 3;
  for (const point of polygon) positions.push(point.x, point.y, z);
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

export function createFitCouponGeometry(
  slotWidth: number,
  settings: Pick<
    LithophaneSettings,
    "slotDepth" | "adapterThickness"
  > = REFERENCE_SETTINGS,
) {
  const profile = createAdapterSlotProfile({
    slotWidth,
    slotDepth: settings.slotDepth,
  });
  const outerHalf = profile.halfSlot + 5 + FIT_COUPON_OUTER_MARGIN;
  const outerDepth = profile.capY + FIT_COUPON_REAR_MARGIN;
  const polygon: Point2[] = [
    ...profile.boundary,
    profile.rightLip,
    { x: outerHalf, y: 0 },
    { x: outerHalf, y: outerDepth },
    { x: -outerHalf, y: outerDepth },
    { x: -outerHalf, y: 0 },
    profile.leftLip,
  ];
  const positions: number[] = [];
  const indices: number[] = [];
  addPolygonFace(positions, indices, polygon, 0, true);
  addPolygonFace(positions, indices, polygon, settings.adapterThickness, false);
  addPolygonWalls(positions, indices, polygon, 0, settings.adapterThickness);

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

export function createFitFinderParts(
  widths: readonly [number, number, number],
  settings: Pick<
    LithophaneSettings,
    "slotDepth" | "adapterThickness"
  > = REFERENCE_SETTINGS,
): FitFinderPart[] {
  const couponWidths = widths.map(
    (slotWidth) =>
      2 * (Math.max(2, slotWidth / 2) + 5 + FIT_COUPON_OUTER_MARGIN),
  );
  const totalWidth =
    couponWidths.reduce((sum, width) => sum + width, 0) + FIT_COUPON_GAP * 2;
  let cursor = -totalWidth / 2;

  return widths.map((slotWidth, index) => {
    const couponWidth = couponWidths[index];
    const centerX = cursor + couponWidth / 2;
    cursor += couponWidth + FIT_COUPON_GAP;
    const profile = createAdapterSlotProfile({
      slotWidth,
      slotDepth: settings.slotDepth,
    });
    const baseGeometry = createFitCouponGeometry(slotWidth, settings);
    baseGeometry.translate(centerX, 0, 0);
    baseGeometry.computeBoundingBox();
    const label = formatSlotWidth(slotWidth);
    const labelGeometry = createFlatLabelGeometry({
      text: label,
      fontSize: 5,
      depth: FIT_LABEL_RAISE,
      centerX,
      baselineY: profile.capY + 3,
      startZ: settings.adapterThickness - 0.05,
    });
    if (!labelGeometry) {
      baseGeometry.dispose();
      throw new Error("The fit-finder label could not be created.");
    }
    return { slotWidth, label, baseGeometry, labelGeometry };
  });
}

export function fitFinderFilename(widths: readonly [number, number, number]) {
  return `base-fit-finder-${widths.map(formatSlotWidth).join("-")}.stl`;
}
