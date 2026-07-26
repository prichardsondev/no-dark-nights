import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
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

test("server-renders the No Dark Nights home and studio", async () => {
  const [homeResponse, studioResponse] = await Promise.all([
    render(),
    render("/studio"),
  ]);

  for (const response of [homeResponse, studioResponse]) {
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  }

  const [homeHtml, studioHtml] = await Promise.all([
    homeResponse.text(),
    studioResponse.text(),
  ]);

  assert.match(
    homeHtml,
    /<title>No Dark Nights \| Make, learn, and share the light<\/title>/i,
  );
  assert.match(homeHtml, /Build a night light from a photo/i);
  assert.match(homeHtml, /Build the whole project/i);
  assert.match(homeHtml, /Make one\. Give one\. Teach one\./i);
  assert.match(homeHtml, /no-dark-nights-social-v2\.png/i);

  assert.match(studioHtml, /Turn a favorite photo into a little light/i);
  assert.match(studioHtml, /Your photo stays on this device/i);
  assert.match(studioHtml, /Choose a photo/i);
  assert.doesNotMatch(
    `${homeHtml}${studioHtml}`,
    /codex-preview|react-loading-skeleton/i,
  );
});

test("major pages have route-specific metadata and repository links", async () => {
  const expected = [
    ["/studio", "Night-light Studio"],
    ["/learn", "Learn"],
    ["/gallery", "Gallery"],
    ["/resources", "Printing Resources"],
    ["/code", "Code"],
    ["/about", "About"],
  ];

  for (const [pathname, title] of expected) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${title} \\| No Dark Nights<\\/title>`, "i"));
    assert.match(html, /<meta name="description" content="[^"]+"/i);
  }

  const [codeResponse, learnResponse, promptsResponse] = await Promise.all([
    render("/code"),
    render("/learn"),
    render("/prompts"),
  ]);
  assert.match(
    await codeResponse.text(),
    /https:\/\/github\.com\/prichardsondev\/no-dark-nights/i,
  );
  const learnHtml = await learnResponse.text();
  assert.match(learnHtml, /Read the step/i);
  assert.match(learnHtml, /Give this prompt to Codex/i);
  assert.match(learnHtml, /You’re finished when/i);
  assert.doesNotMatch(learnHtml, /\boptional\b|Try it yourself/i);
  assert.match(
    learnHtml,
    /Project link: https:\/\/github\.com\/prichardsondev\/no-dark-nights/i,
  );
  assert.ok([307, 308].includes(promptsResponse.status));
  const redirectLocation = new URL(
    promptsResponse.headers.get("location") ?? "",
    "http://localhost",
  );
  assert.equal(`${redirectLocation.pathname}${redirectLocation.hash}`, "/learn#step-1");
});

test("keeps STL generation local and removes starter UI", async () => {
  const [studio, geometry, homePage, studioPage, packageJson] = await Promise.all([
    readFile(new URL("../app/LithophaneStudio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/lithophane-geometry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/studio/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(studio, /createImageBitmap/);
  assert.match(studio, /STLExporter/);
  assert.match(studio, /new Blob/);
  assert.doesNotMatch(studio, /\bfetch\s*\(/);
  assert.match(geometry, /computeVertexNormals/);
  assert.match(geometry, /geometry\.setIndex/);
  assert.match(homePage, /<SiteShell>/);
  assert.match(studioPage, /<LithophaneStudio \/>/);
  assert.match(packageJson, /"three"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.deepEqual(await readdir(previewRoot), []);
  await access(
    new URL("../public/no-dark-nights-social-v2.png", import.meta.url),
  );
  await access(new URL(".openai/hosting.json", templateRoot));
});

test("keeps every gallery image inside an equal frame", async () => {
  const [homePage, galleryPage, siteChrome, studio, styles] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/gallery/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/SiteChrome.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/LithophaneStudio.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    ]);

  assert.match(homePage, /className="gallery-image-frame"/);
  assert.match(galleryPage, /className="gallery-image-frame"/);
  assert.match(styles, /\.gallery-image-frame\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*5/s);
  assert.match(
    styles,
    /\.gallery-image-frame img\s*\{[^}]*object-fit:\s*contain/s,
  );
  assert.doesNotMatch(`${siteChrome}${studio}`, /brand-mark|brand-moon|brand-lamp/);
  assert.match(siteChrome, /className="brand-dot"/);
  assert.match(studio, /className="brand-dot"/);
});
