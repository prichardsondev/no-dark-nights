import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import {
  createLithophaneGeometry,
  DEFAULT_CROP,
  DEFAULT_SETTINGS,
} from "../app/lithophane-geometry.ts";
import { detectWebGLSupport } from "../app/webgl-support.ts";

test("detects unavailable and failed WebGL initialization", () => {
  assert.equal(
    detectWebGLSupport(() => ({ getContext: () => null })),
    false,
  );
  assert.equal(
    detectWebGLSupport(() => ({
      getContext() {
        throw new Error("WebGL is blocked");
      },
    })),
    false,
  );
  assert.equal(
    detectWebGLSupport(() => ({
      getContext: (kind) => (kind === "webgl" ? {} : null),
    })),
    true,
  );
});

test("Studio keeps controls and STL generation available without WebGL", async () => {
  const studio = await readFile(
    new URL("../app/LithophaneStudio.tsx", import.meta.url),
    "utf8",
  );

  assert.match(studio, /detectWebGLSupport/);
  assert.match(studio, /PreviewErrorBoundary/);
  assert.match(studio, /interactive 3D preview cannot start/i);
  assert.match(studio, /you can still download the\s+printable STL/i);
  assert.match(studio, /const generateStl = async/);
  assert.match(studio, /createLithophaneGeometry/);
  assert.match(studio, /new STLExporter/);
});

test("exports a neutral image to binary STL without a WebGL renderer", () => {
  const width = 8;
  const height = 8;
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < data.length; index += 4) {
    const shade = Math.round((index / 4 / (width * height - 1)) * 255);
    data.set([shade, shade, shade, 255], index);
  }

  const geometry = createLithophaneGeometry(
    { data, width, height },
    DEFAULT_CROP,
    {
      ...DEFAULT_SETTINGS,
      width: 40,
      height: 45,
      radius: 50,
      resolution: 2,
    },
  );
  const result = new STLExporter().parse(new THREE.Mesh(geometry), {
    binary: true,
  });

  assert.ok(result instanceof DataView);
  assert.ok(result.byteLength > 84);
  assert.equal(result.getUint32(80, true) * 50 + 84, result.byteLength);
  geometry.dispose();
});
