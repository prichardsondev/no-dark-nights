import assert from "node:assert/strict";
import test from "node:test";
import { REFERENCE_SETTINGS } from "../app/lithophane-geometry.ts";
import {
  COMPACT_SIZE_PRESET,
  STANDARD_SIZE_PRESET,
  applyDefaultFit,
  applySizePreset,
} from "../app/lithophane-presets.ts";

test("size presets preserve every user-adjusted base setting", () => {
  const adjusted = {
    ...REFERENCE_SETTINGS,
    slotWidth: 16.8,
    slotDepth: 22,
    lightDistance: 8.5,
    adapterThickness: 2.6,
  };

  for (const preset of [STANDARD_SIZE_PRESET, COMPACT_SIZE_PRESET]) {
    const next = applySizePreset(adjusted, preset);
    assert.equal(next.slotWidth, adjusted.slotWidth);
    assert.equal(next.slotDepth, adjusted.slotDepth);
    assert.equal(next.lightDistance, adjusted.lightDistance);
    assert.equal(next.adapterThickness, adjusted.adapterThickness);
  }
});

test("Default fit does not silently replace adapter thickness", () => {
  const adjusted = { ...REFERENCE_SETTINGS, adapterThickness: 2.4 };
  const next = applyDefaultFit(adjusted);

  assert.equal(next.adapterThickness, 2.4);
  assert.equal(next.slotWidth, REFERENCE_SETTINGS.slotWidth);
});
