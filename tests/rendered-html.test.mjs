import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        host: "localhost",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the No Dark Nights studio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Night-light Studio \| No Dark Nights<\/title>/i);
  assert.match(html, /Turn a favorite photo into a little light/i);
  assert.match(html, /Your photo stays on this device/i);
  assert.match(html, /Choose a photo/i);
  assert.match(html, /og\.png/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps STL generation local and removes starter UI", async () => {
  const [studio, geometry, page, packageJson] = await Promise.all([
    readFile(new URL("../app/LithophaneStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lithophane-geometry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(studio, /createImageBitmap/);
  assert.match(studio, /STLExporter/);
  assert.match(studio, /new Blob/);
  assert.doesNotMatch(studio, /\bfetch\s*\(/);
  assert.match(geometry, /computeVertexNormals/);
  assert.match(geometry, /geometry\.setIndex/);
  assert.match(page, /<LithophaneStudio \/>/);
  assert.match(packageJson, /"three"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.deepEqual(await readdir(previewRoot), []);
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL(".openai/hosting.json", templateRoot));
});
