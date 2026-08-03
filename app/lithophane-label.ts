import * as THREE from "three";
import fontData from "three.regular.helvetiker";
import {
  FontLoader,
  type Font,
} from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { LithophaneSettings } from "./lithophane-geometry.ts";

export const MAX_LABEL_LENGTH = 28;
export const LABEL_RAISE = 0.65;
export const DEFAULT_LABEL_SIZE = 8;
export const MIN_LABEL_SIZE = 5;
export const MAX_LABEL_SIZE = 10;

const labelFont = new FontLoader().parse(fontData);

export function normalizeLabelText(text: string, font: Font = labelFont) {
  return Array.from(text.normalize("NFKC").replace(/\s+/g, " ").trim())
    .slice(0, MAX_LABEL_LENGTH)
    .map((character) =>
      character === " " || font.data.glyphs[character] ? character : "?",
    )
    .join("");
}

export function createLabelGeometry(
  text: string,
  settings: LithophaneSettings,
  requestedFontSize = DEFAULT_LABEL_SIZE,
) {
  const label = normalizeLabelText(text);
  if (!label) return null;

  const resolution = labelFont.data.resolution;
  const letterSpacing = 0.08;
  const advances = Array.from(label).map((character) => {
    const glyph = labelFont.data.glyphs[character];
    return (glyph?.ha ?? labelFont.data.glyphs["?"].ha) / resolution;
  });
  const naturalWidth =
    advances.reduce((sum, advance) => sum + advance, 0) +
    letterSpacing * Math.max(0, advances.length - 1);
  const maximumWidth = Math.min(72, settings.width * 0.78);
  const safeFontSize = THREE.MathUtils.clamp(
    requestedFontSize,
    MIN_LABEL_SIZE,
    MAX_LABEL_SIZE,
  );
  const fontSize = Math.min(
    safeFontSize,
    maximumWidth / Math.max(0.1, naturalWidth),
  );
  const labelWidth = naturalWidth * fontSize;
  const depth = settings.adapterThickness + LABEL_RAISE;
  const slotCapY = settings.slotDepth + settings.slotWidth / 2;
  const edgeBaselineY = slotCapY + 4;
  const arcLift = Math.min(7.5, labelWidth * 0.14);
  const characterGeometries: THREE.BufferGeometry[] = [];
  let cursor = -labelWidth / 2;

  Array.from(label).forEach((character, index) => {
    const advance = advances[index] * fontSize;
    const centerX = cursor + advance / 2;
    cursor +=
      advance + (index < advances.length - 1 ? letterSpacing * fontSize : 0);
    if (character === " ") return;

    const geometry = new TextGeometry(character, {
      font: labelFont,
      size: fontSize,
      depth,
      curveSegments: 4,
      bevelEnabled: false,
    });
    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox;
    if (!bounds) {
      geometry.dispose();
      return;
    }
    const glyphCenterX = (bounds.min.x + bounds.max.x) / 2;
    const normalizedX = labelWidth > 0 ? (2 * centerX) / labelWidth : 0;
    const baselineY = edgeBaselineY + arcLift * (1 - normalizedX * normalizedX);
    const slope =
      labelWidth > 0 ? (-8 * arcLift * centerX) / (labelWidth * labelWidth) : 0;

    geometry.translate(-glyphCenterX, 0, 0);
    geometry.rotateZ(Math.atan(slope));
    geometry.translate(centerX, baselineY, 0);
    characterGeometries.push(geometry);
  });

  if (characterGeometries.length === 0) return null;
  const merged = mergeGeometries(characterGeometries, false);
  for (const geometry of characterGeometries) geometry.dispose();
  if (!merged) return null;
  merged.computeVertexNormals();
  merged.computeBoundingBox();
  return merged;
}

export function createFlatLabelGeometry({
  text,
  fontSize,
  depth,
  centerX,
  baselineY,
  startZ,
}: {
  text: string;
  fontSize: number;
  depth: number;
  centerX: number;
  baselineY: number;
  startZ: number;
}) {
  const label = normalizeLabelText(text);
  if (!label) return null;

  const geometry = new TextGeometry(label, {
    font: labelFont,
    size: fontSize,
    depth,
    curveSegments: 4,
    bevelEnabled: false,
  });
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  if (!bounds) {
    geometry.dispose();
    return null;
  }
  geometry.translate(
    centerX - (bounds.min.x + bounds.max.x) / 2,
    baselineY - bounds.min.y,
    startZ,
  );
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}
