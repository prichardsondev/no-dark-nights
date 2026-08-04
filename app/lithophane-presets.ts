import {
  REFERENCE_SETTINGS,
  type LithophaneSettings,
} from "./lithophane-geometry.ts";

export type LithophaneSizePreset = Pick<
  LithophaneSettings,
  "width" | "height" | "resolution"
>;

export const STANDARD_SIZE_PRESET: LithophaneSizePreset = {
  width: 120,
  height: 105,
  resolution: 0.5,
};

export const COMPACT_SIZE_PRESET: LithophaneSizePreset = {
  ...STANDARD_SIZE_PRESET,
  width: 80,
};

export function applySizePreset(
  current: LithophaneSettings,
  preset: LithophaneSizePreset,
) {
  return { ...current, ...preset };
}

export function applyDefaultFit(current: LithophaneSettings) {
  return {
    ...REFERENCE_SETTINGS,
    adapterThickness: current.adapterThickness,
  };
}
