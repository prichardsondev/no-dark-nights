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
  assert.match(homeHtml, /Buy a Light/i);
  assert.match(homeHtml, /Make an STL/i);
  assert.match(homeHtml, /Build Your Own Site/i);
  assert.match(homeHtml, /No coding or AI agent required/i);
  assert.match(homeHtml, /A real project with two ways in/i);
  assert.match(homeHtml, /AI agent literacy/i);
  assert.match(homeHtml, /Privacy, consent, and responsible publishing/i);
  assert.match(homeHtml, /Make one\. Give one\. Teach one\./i);
  assert.match(homeHtml, /no-dark-nights-social-v2\.png/i);

  assert.match(studioHtml, /Turn a favorite photo into a little light/i);
  assert.match(studioHtml, /Your photo stays on this device/i);
  assert.match(studioHtml, /Choose a photo/i);
  assert.match(studioHtml, /Add a name or message/i);
  assert.match(studioHtml, /aria-label="Bottom text"/i);
  assert.doesNotMatch(
    `${homeHtml}${studioHtml}`,
    /codex-preview|react-loading-skeleton/i,
  );
});

test("major pages have route-specific metadata and repository links", async () => {
  const expected = [
    ["/studio", "Night-light Studio"],
    ["/lights", "Lights"],
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
  assert.match(learnHtml, /Optional — after step seven/i);
  assert.match(learnHtml, /Keep improving/i);
  assert.match(learnHtml, /The numbered path is complete/i);
  assert.match(
    learnHtml,
    /Project link: https:\/\/github\.com\/prichardsondev\/no-dark-nights/i,
  );
  assert.match(learnHtml, /Create your lithophane STL/i);
  assert.match(learnHtml, /Keep the photograph on my computer/i);
  assert.match(learnHtml, /Download the printable STL/i);
  assert.match(learnHtml, /Slice, fit-test, print, and share/i);
  assert.match(learnHtml, /adapter-only fit test/i);
  assert.match(learnHtml, /one set of slicer settings works for every machine/i);
  assert.match(learnHtml, /Your first custom lithophane STL\./i);
  assert.match(
    learnHtml,
    /A working night light and a story you can share\./i,
  );
  assert.ok([307, 308].includes(promptsResponse.status));
  const redirectLocation = new URL(
    promptsResponse.headers.get("location") ?? "",
    "http://localhost",
  );
  assert.equal(`${redirectLocation.pathname}${redirectLocation.hash}`, "/learn#step-1");
});

test("homepage presents three clear paths and Lights belongs to this maker", async () => {
  const [homeResponse, lightsResponse, makerData] = await Promise.all([
    render("/"),
    render("/lights"),
    readFile(new URL("../app/maker-profile.ts", import.meta.url), "utf8"),
  ]);
  assert.equal(homeResponse.status, 200);
  assert.equal(lightsResponse.status, 200);

  const [homeHtml, lightsHtml] = await Promise.all([
    homeResponse.text(),
    lightsResponse.text(),
  ]);

  assert.match(homeHtml, /href="\/lights"[^>]*>[\s\S]*?Buy a Light/i);
  assert.match(homeHtml, /href="\/studio"[^>]*>[\s\S]*?Make an STL/i);
  assert.match(
    homeHtml,
    /href="\/learn#step-1"[^>]*>[\s\S]*?Build Your Own Site/i,
  );
  assert.match(homeHtml, /Lights[\s\S]*Studio[\s\S]*Learn/i);

  assert.match(lightsHtml, /This page belongs to the owner of this site/i);
  assert.match(lightsHtml, /not a marketplace or a directory/i);
  assert.match(lightsHtml, /Example listing/i);
  assert.match(lightsHtml, /example listings until the site owner replaces them/i);
  assert.match(lightsHtml, /arranged directly with the adult owner of this site/i);
  assert.doesNotMatch(lightsHtml, /<form|<input|<button/i);

  assert.match(makerData, /PERSONALIZE THIS FILE FIRST/);
  assert.match(makerData, /studioName/);
  assert.match(makerData, /contactHref/);
  assert.match(makerData, /isExample:\s*true/);
  assert.match(makerData, /Never put a child's personal email address/i);
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
  assert.match(
    styles,
    /a:focus-visible[\s\S]{0,240}outline:\s*3px solid/i,
  );
  assert.match(styles, /\.ndn-nav\s*\{[\s\S]*?overflow-x:\s*auto/s);
});
