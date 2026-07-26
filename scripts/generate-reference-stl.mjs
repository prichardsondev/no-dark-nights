import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import {
  DEFAULT_CROP,
  REFERENCE_SETTINGS,
  calculateUncroppedWidth,
  createLithophaneGeometry,
} from "../app/lithophane-geometry.ts";

const imagePath = process.argv[2];
const outputPath =
  process.argv[3] ?? path.join(process.cwd(), "reference-compatible.stl");

if (!imagePath) {
  throw new Error(
    "Usage: node --experimental-strip-types scripts/generate-reference-stl.mjs image.png [output.stl]",
  );
}

const { data, info } = await sharp(imagePath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const source = {
  data: new Uint8ClampedArray(
    data.buffer,
    data.byteOffset,
    data.byteLength,
  ),
  width: info.width,
  height: info.height,
};
const settings = {
  ...REFERENCE_SETTINGS,
  width: calculateUncroppedWidth(info.width / info.height, REFERENCE_SETTINGS),
};
const geometry = createLithophaneGeometry(
  source,
  DEFAULT_CROP,
  settings,
);
const mesh = new THREE.Mesh(geometry);
const exported = new STLExporter().parse(mesh, { binary: true });
const bytes =
  exported instanceof DataView
    ? Buffer.from(exported.buffer, exported.byteOffset, exported.byteLength)
    : Buffer.from(exported);

fs.writeFileSync(outputPath, bytes);
geometry.computeBoundingBox();
console.log(
  JSON.stringify(
    {
      outputPath,
      bytes: bytes.length,
      triangles: geometry.getIndex().count / 3,
      bounds: {
        min: geometry.boundingBox.min.toArray(),
        max: geometry.boundingBox.max.toArray(),
      },
      settings,
    },
    null,
    2,
  ),
);
geometry.dispose();
