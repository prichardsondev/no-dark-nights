export type Point2 = {
  x: number;
  y: number;
};

export const SLOT_WIDTH_MIN = 10;
export const SLOT_WIDTH_MAX = 30;
export const ADAPTER_ENTRY_LIP_WIDTH = 5;
export const PRODUCTION_SLOT_SEGMENTS = 30;

export type AdapterSlotProfile = {
  boundary: Point2[];
  leftLip: Point2;
  rightLip: Point2;
  halfSlot: number;
  capY: number;
};

/**
 * The single source of truth for the production adapter opening.
 *
 * The boundary begins at the left-hand entry, follows the rounded slot cap,
 * and ends at the right-hand entry. The lip points preserve the 5 mm material
 * on either side of the opening.
 */
export function createAdapterSlotProfile({
  slotWidth,
  slotDepth,
  segments = PRODUCTION_SLOT_SEGMENTS,
}: {
  slotWidth: number;
  slotDepth: number;
  segments?: number;
}): AdapterSlotProfile {
  const halfSlot = Math.max(2, slotWidth / 2);
  const safeSegments = Math.max(3, Math.round(segments));
  const boundary: Point2[] = [{ x: -halfSlot, y: 0 }];

  for (let segment = 0; segment <= safeSegments; segment += 1) {
    const slotAngle = Math.PI - (segment / safeSegments) * Math.PI;
    boundary.push({
      x: Math.cos(slotAngle) * halfSlot,
      y: slotDepth + Math.sin(slotAngle) * halfSlot,
    });
  }
  boundary.push({ x: halfSlot, y: 0 });

  return {
    boundary,
    leftLip: { x: -halfSlot - ADAPTER_ENTRY_LIP_WIDTH, y: 0 },
    rightLip: { x: halfSlot + ADAPTER_ENTRY_LIP_WIDTH, y: 0 },
    halfSlot,
    capY: slotDepth + halfSlot,
  };
}
