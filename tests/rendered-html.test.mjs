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
  assert.match(
    homeHtml,
    /use an AI agent to build your own personalized lithophane website/i,
  );
  assert.match(
    homeHtml,
    /Use an AI agent to build, test, and publish your own personalized lithophane website/i,
  );
  assert.match(
    homeHtml,
    /personalized, tested, and published lithophane website/i,
  );
  assert.doesNotMatch(homeHtml, /their own copy|your own version/i);
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
  assert.match(learnHtml, /Before Step 1/i);
  assert.match(learnHtml, /Get ready/i);
  assert.match(learnHtml, /Access to Codex through the ChatGPT desktop app/i);
  assert.match(learnHtml, /An adult(?:&apos;|&#x27;|')s help if you are under 13/i);
  assert.match(learnHtml, /Download and install the official ChatGPT desktop app/i);
  assert.match(learnHtml, /Sign in and open Codex/i);
  assert.match(learnHtml, /Return here and begin Step 1/i);
  assert.match(learnHtml, /Download ChatGPT desktop/i);
  assert.match(learnHtml, /https:\/\/chatgpt\.com\/download\//i);
  assert.match(
    learnHtml,
    /href="#school-lab-setup"[^>]*>Educator or school lab\? View managed setup options\./i,
  );
  const setupHtml = learnHtml.match(
    /<section class="setup-section"[\s\S]*?<\/section>/i,
  )?.[0];
  assert.ok(setupHtml, "Learn page should render the beginner setup section");
  assert.doesNotMatch(setupHtml, /Amazon Bedrock|AWS credentials|GitHub|Sites/i);
  assert.match(learnHtml, /For educators running a school lab/i);
  assert.ok(
    learnHtml.indexOf("For educators running a school lab") >
      learnHtml.indexOf("Optional — after step eight"),
    "Managed school-lab setup should appear after the numbered learning path",
  );
  assert.match(learnHtml, /ChatGPT is not intended for children under 13/i);
  assert.match(learnHtml, /ages 13–17 need permission from a parent or guardian/i);
  assert.match(learnHtml, /adult must conduct the direct interaction/i);
  assert.match(learnHtml, /Amazon Bedrock can provide supported OpenAI models/i);
  assert.match(
    learnHtml,
    /https:\/\/learn\.chatgpt\.com\/docs\/amazon-bedrock/i,
  );
  assert.match(learnHtml, /Students must never paste AWS credentials/i);
  assert.match(learnHtml, /limited, revocable student access/i);
  assert.match(learnHtml, /Sites are not available through Bedrock-only authentication/i);
  assert.match(learnHtml, /approved GitHub repository are valid completion points/i);
  assert.match(learnHtml, /Optional — after step eight/i);
  assert.match(learnHtml, /Keep improving/i);
  assert.match(learnHtml, /The eight-step path is complete/i);
  assert.match(
    learnHtml,
    /Project link: https:\/\/github\.com\/prichardsondev\/no-dark-nights/i,
  );
  assert.match(
    learnHtml,
    /Original site: https:\/\/nodarknights\.com/i,
  );
  assert.match(
    learnHtml,
    /I want to build the No Dark Nights project\.[\s\S]*Original site: https:\/\/nodarknights\.com[\s\S]*Project link: https:\/\/github\.com\/prichardsondev\/no-dark-nights/i,
  );
  assert.match(learnHtml, /Create your lithophane STL/i);
  assert.match(learnHtml, /Save your work with Git and GitHub/i);
  assert.match(learnHtml, /Never force-push, delete history/i);
  assert.match(learnHtml, /Test the website and STL/i);
  assert.match(learnHtml, /complete automated suite passes/i);
  assert.match(learnHtml, /If Sites is unavailable/i);
  assert.match(learnHtml, /If I use Bedrock-only authentication/i);
  assert.match(learnHtml, /Do not keep retrying Sites/i);
  assert.match(learnHtml, /instructor can separately review and publish/i);
  assert.match(learnHtml, /Publishing is optional/i);
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
  assert.match(learnHtml, /What this teaches/i);
  assert.match(learnHtml, /What you need first/i);
  assert.match(learnHtml, /Stop or ask permission when/i);
  assert.match(learnHtml, /What you should inspect/i);
  assert.match(learnHtml, /Reflect/i);
  assert.match(learnHtml, /For educators/i);
  assert.match(learnHtml, /Do not require a public website/i);
  assert.match(
    learnHtml,
    /working website they can continue using as a maker portfolio, community-giving project, or foundation for a small creative enterprise/i,
  );

  const readme = await readFile(
    new URL("../README.md", import.meta.url),
    "utf8",
  );
  assert.match(readme, /Amazon Bedrock/);
  assert.match(
    readme,
    /approved\s+learner or school-managed GitHub repository/,
  );
  assert.match(
    readme,
    /Sites are not available through Bedrock-only\s+authentication/,
  );
  assert.ok([307, 308].includes(promptsResponse.status));
  const redirectLocation = new URL(
    promptsResponse.headers.get("location") ?? "",
    "http://localhost",
  );
  assert.equal(`${redirectLocation.pathname}${redirectLocation.hash}`, "/learn#step-1");
});

test("Studio explains the physical tools and Resources lists safe examples", async () => {
  const [studioResponse, resourcesResponse] = await Promise.all([
    render("/studio"),
    render("/resources"),
  ]);
  const [studioHtml, resourcesHtml] = await Promise.all([
    studioResponse.text(),
    resourcesResponse.text(),
  ]);

  assert.match(studioHtml, /The Studio creates an STL file/i);
  assert.match(studioHtml, /slicer software/i);
  assert.match(studioHtml, /compatible 3D printer/i);
  assert.match(studioHtml, /href="\/resources"/i);
  assert.match(
    studioHtml,
    /Before printing[\s\S]*href="\/resources"[^>]*>View printing resources/i,
  );

  assert.match(resourcesHtml, /What we use/i);
  assert.match(resourcesHtml, /amazon\.com\/dp\/B06VTGDD33/i);
  assert.match(resourcesHtml, /amazon\.com\/dp\/B078YCCTTJ/i);
  assert.match(resourcesHtml, /products\/a1-mini/i);
  assert.match(resourcesHtml, /products\/pla-basic-filament/i);
  assert.match(resourcesHtml, /LED bulbs only/i);
  assert.match(resourcesHtml, /16\.5 mm style/i);
  assert.match(resourcesHtml, /No affiliate links/i);
  assert.match(resourcesHtml, /does not earn money or receive commission/i);
  assert.equal(
    [
      ...resourcesHtml.matchAll(
        /href="https:\/\/(?:www\.amazon\.com|us\.store\.bambulab\.com)[^"]*" target="_blank" rel="noopener noreferrer"/gi,
      ),
    ].length,
    4,
  );
});

test("homepage presents three clear paths and Lights belongs to this maker", async () => {
  const [homeResponse, lightsResponse, makerData, profileModule] = await Promise.all([
    render("/"),
    render("/lights"),
    readFile(new URL("../app/maker-profile.ts", import.meta.url), "utf8"),
    import("../app/maker-profile.ts"),
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

  assert.match(lightsHtml, /Lights I can make/i);
  assert.match(
    lightsHtml,
    /Contact the maker to ask about creating one from your photograph or artwork/i,
  );
  assert.doesNotMatch(lightsHtml, /Example listing/i);
  assert.doesNotMatch(lightsHtml, />Gift</i);
  assert.match(lightsHtml, /Interested in a light\?/i);
  assert.match(
    lightsHtml,
    /Availability, cost, pickup, shipping, and payment—when applicable—are arranged directly with the maker/i,
  );
  assert.match(lightsHtml, /For parents and young makers/i);
  assert.match(lightsHtml, /Never publish a child(?:&#x27;|')s personal email/i);
  assert.match(lightsHtml, /not a child(?:&#x27;|')s home address/i);
  assert.doesNotMatch(lightsHtml, /<form|<input|<button/i);

  assert.match(makerData, /PERSONALIZE THIS FILE FIRST/);
  assert.match(makerData, /studioName/);
  assert.match(makerData, /contactHref/);
  assert.match(makerData, /contactLabel:\s*"Contact the maker"/);
  assert.doesNotMatch(makerData, /nodarknights\.com/i);
  assert.doesNotMatch(makerData, /Example listing|offerLabel:\s*"Gift"/i);
  assert.match(makerData, /Never put a child's personal email address/i);

  if (profileModule.isValidContactHref(profileModule.makerProfile.contactHref)) {
    assert.match(lightsHtml, /Contact the maker[\s\S]{0,30}↗/i);
    assert.match(lightsHtml, /This opens an email addressed to/i);
    assert.match(lightsHtml, /paul@oddlytrue\.ai/i);
    assert.doesNotMatch(lightsHtml, /contactHref|app\/maker-profile\.ts/i);
  } else {
    assert.match(
      lightsHtml,
      /An adult-controlled contact method has not been configured yet/i,
    );
  }
});

test("Learn Step 3 keeps contact personalization guidance off the Lights page", async () => {
  const { promptCards } = await import("../app/site-data.ts");
  const stepThree = promptCards.find((card) => card.stage === "Step 3");

  assert.ok(stepThree);
  assert.match(stepThree.prompt, /contactHref in app\/maker-profile\.ts/i);
});

test("maker contact links accept safe email or web destinations", async () => {
  const { getMailtoAddress, isValidContactHref } = await import(
    "../app/maker-profile.ts"
  );

  assert.equal(isValidContactHref("mailto:adult@example.org"), true);
  assert.equal(isValidContactHref("https://example.org/contact"), true);
  assert.equal(isValidContactHref(""), false);
  assert.equal(isValidContactHref("mailto:not-an-address"), false);
  assert.equal(isValidContactHref("javascript:alert(1)"), false);
  assert.equal(isValidContactHref("http://example.org/contact"), false);
  assert.equal(
    getMailtoAddress("mailto:adult@example.org?subject=Light"),
    "adult@example.org",
  );
  assert.equal(getMailtoAddress("https://example.org/contact"), null);
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
