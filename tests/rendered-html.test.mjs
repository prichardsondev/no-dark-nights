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
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    assert.equal(
      response.headers.get("strict-transport-security"),
      "max-age=31536000",
    );
    assert.match(
      response.headers.get("content-security-policy") ?? "",
      /default-src 'self'[\s\S]*frame-ancestors 'none'/i,
    );
  }

  const [homeHtml, studioHtml] = await Promise.all([
    homeResponse.text(),
    studioResponse.text(),
  ]);

  assert.match(
    homeHtml,
    /<title>No Dark Nights \| Make, learn, and share the light<\/title>/i,
  );
  assert.match(homeHtml, /Make an STL/i);
  assert.match(homeHtml, /Learn &amp; Build/i);
  assert.match(homeHtml, /See the Lights/i);
  assert.doesNotMatch(homeHtml, /Buy a Light/i);
  assert.match(homeHtml, /No coding or AI agent is required/i);
  assert.match(
    homeHtml,
    /personalized, tested, and published lithophane website/i,
  );
  assert.match(homeHtml, /publish your own version/i);
  assert.match(homeHtml, /A real project with two ways in/i);
  assert.match(homeHtml, /AI agent literacy/i);
  assert.match(homeHtml, /Privacy, consent, and responsible publishing/i);
  assert.match(homeHtml, /Make one\. Give one\. Teach one\./i);
  assert.match(homeHtml, /no-dark-nights-social-v2\.png/i);

  assert.match(studioHtml, /Turn a favorite photo into a little light/i);
  assert.match(studioHtml, /Your photo stays on this device/i);
  assert.match(studioHtml, /Choose a photo/i);
  assert.match(studioHtml, /Optional short message/i);
  assert.match(studioHtml, /aria-label="Bottom text"/i);
  assert.match(studioHtml, /placeholder="Shine bright"/i);
  assert.match(
    studioHtml,
    /Do not include a[\s\S]*full name, school, address, email, phone number, username, or[\s\S]*website/i,
  );
  assert.match(
    studioHtml,
    /Attaching a[\s\S]*private photo to Codex is a separate action/i,
  );
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
    ["/safety", "Safety &amp; Privacy"],
  ];

  for (const [pathname, title] of expected) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(
      html,
      new RegExp(`<title>${title} \\| No Dark Nights<\\/title>`, "i"),
    );
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
  assert.match(learnHtml, /Who is managing this project\?/i);
  assert.match(learnHtml, /Adult maker/i);
  assert.match(learnHtml, /Young maker with an adult/i);
  assert.match(learnHtml, /School, library, or makerspace/i);
  assert.match(
    learnHtml,
    /Everyone follows the same learning path\. This choice only changes account, publishing, and contact guidance\./i,
  );
  assert.match(learnHtml, /<fieldset>[\s\S]*learner-setup[\s\S]*<\/fieldset>/i);
  assert.match(
    learnHtml,
    /<legend class="sr-only">Choose one working setup<\/legend>/i,
  );
  assert.equal([...learnHtml.matchAll(/name="learner-setup"/gi)].length, 3);
  assert.match(
    learnHtml,
    /role="status" aria-live="polite" aria-atomic="true"/i,
  );
  assert.match(learnHtml, /<button disabled="" type="button">Copy prompt/i);
  assert.match(
    learnHtml,
    /Download and install the official ChatGPT desktop app/i,
  );
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
  assert.doesNotMatch(
    setupHtml,
    /Amazon Bedrock|AWS credentials|GitHub|Sites/i,
  );
  assert.match(learnHtml, /For educators running a school lab/i);
  assert.ok(
    learnHtml.indexOf("For educators running a school lab") >
      learnHtml.indexOf("Optional — after step eight"),
    "Managed school-lab setup should appear after the numbered learning path",
  );
  assert.match(learnHtml, /ChatGPT is not intended for children under 13/i);
  assert.match(
    learnHtml,
    /ages 13–17 need permission from a parent or guardian/i,
  );
  assert.match(learnHtml, /adult must conduct the direct interaction/i);
  assert.match(
    learnHtml,
    /Amazon Bedrock can provide supported OpenAI models/i,
  );
  assert.match(
    learnHtml,
    /https:\/\/learn\.chatgpt\.com\/docs\/amazon-bedrock/i,
  );
  assert.match(learnHtml, /Students must never paste AWS credentials/i);
  assert.match(learnHtml, /limited, revocable student access/i);
  assert.match(
    learnHtml,
    /Sites are not available through Bedrock-only authentication/i,
  );
  assert.match(
    learnHtml,
    /approved GitHub repository are valid completion points/i,
  );
  assert.match(learnHtml, /Optional — after step eight/i);
  assert.match(learnHtml, /Keep improving/i);
  assert.match(learnHtml, /The eight-step path is complete/i);
  assert.match(
    learnHtml,
    /Project link: https:\/\/github\.com\/prichardsondev\/no-dark-nights/i,
  );
  assert.match(learnHtml, /Original site: https:\/\/nodarknights\.com/i);
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
  assert.match(learnHtml, /Source image: local private image—not stored/i);
  assert.doesNotMatch(learnHtml, /Record the source image filename/i);
  assert.match(learnHtml, /Download the printable STL/i);
  assert.match(learnHtml, /Slice, fit-test, print, and share/i);
  assert.match(learnHtml, /adapter-only fit test/i);
  assert.match(
    learnHtml,
    /one set of slicer settings works for every machine/i,
  );
  assert.match(learnHtml, /Your first custom lithophane STL\./i);
  assert.match(learnHtml, /A working night light and a story you can share\./i);
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
  assert.equal(
    `${redirectLocation.pathname}${redirectLocation.hash}`,
    "/learn#step-1",
  );
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
  assert.match(resourcesHtml, /Adults handle purchases/i);
  assert.match(
    resourcesHtml,
    /Children use 3D printers only with adult supervision/i,
  );
  assert.match(resourcesHtml, /Avoid hot and moving parts/i);
  assert.match(resourcesHtml, /safety and ventilation instructions/i);
  assert.match(
    resourcesHtml,
    /commercially manufactured, undamaged LED night-light/i,
  );
  assert.match(resourcesHtml, /Never print or modify electrical components/i);
  assert.match(
    resourcesHtml,
    /trusted adult inspects the finished print and plugs in the[\s\S]*light/i,
  );
  assert.equal(
    [
      ...resourcesHtml.matchAll(
        /href="https:\/\/(?:www\.amazon\.com|us\.store\.bambulab\.com)[^"]*" target="_blank" rel="noopener noreferrer"/gi,
      ),
    ].length,
    4,
  );
});

test("Safety, gallery, and publishing guidance protect children and private photos", async () => {
  const [safetyResponse, galleryResponse] = await Promise.all([
    render("/safety"),
    render("/gallery"),
  ]);
  const [safetyHtml, galleryHtml] = await Promise.all([
    safetyResponse.text(),
    galleryResponse.text(),
  ]);

  assert.match(safetyHtml, /No account is required to use the Studio/i);
  assert.match(
    safetyHtml,
    /processes the source photograph locally and[\s\S]*does not intentionally upload it/i,
  );
  assert.match(safetyHtml, /STL generation happens in the browser/i);
  assert.match(
    safetyHtml,
    /does not intentionally collect children(?:&apos;|&#x27;|')s[\s\S]*contact information/i,
  );
  assert.match(safetyHtml, /normal connection data/i);
  assert.match(safetyHtml, /necessary security cookies/i);
  assert.match(
    safetyHtml,
    /External services and links have[\s\S]*their own privacy policies/i,
  );
  assert.match(safetyHtml, /Do not provide private photographs to Codex/i);
  assert.match(safetyHtml, /Adults control contact, purchasing, publication/i);
  assert.match(safetyHtml, /Report a concern/i);
  assert.match(safetyHtml, /Report a vulnerability privately/i);
  assert.match(
    safetyHtml,
    /github\.com\/prichardsondev\/no-dark-nights\/security\/advisories\/new/i,
  );

  assert.match(galleryHtml, /Before adding a gallery photo/i);
  assert.match(galleryHtml, /Get adult permission/i);
  assert.match(galleryHtml, /remove EXIF and location metadata/i);
  assert.match(
    galleryHtml,
    /addresses, school names, uniforms, license plates/i,
  );
  assert.match(galleryHtml, /recognizable locations/i);
  assert.match(galleryHtml, /no full names or identifying filenames/i);
});

test("homepage presents three clear paths and Lights belongs to this maker", async () => {
  const [homeResponse, lightsResponse, makerData, profileModule] =
    await Promise.all([
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

  assert.match(homeHtml, /href="\/studio"[^>]*>[\s\S]*?Make an STL/i);
  assert.match(homeHtml, /href="\/learn"[^>]*>[\s\S]*?Learn &amp; Build/i);
  assert.match(homeHtml, /href="\/lights"[^>]*>[\s\S]*?See the Lights/i);
  assert.match(
    homeHtml,
    /Studio[\s\S]*Learn[\s\S]*Lights[\s\S]*Gallery[\s\S]*Resources[\s\S]*Code/i,
  );

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
  assert.match(
    lightsHtml,
    /Never publish a child(?:&#x27;|')s personal email/i,
  );
  assert.match(lightsHtml, /not a child(?:&#x27;|')s home address/i);
  assert.doesNotMatch(lightsHtml, /<form|<input|<button/i);

  assert.match(makerData, /PERSONALIZE THIS FILE FIRST/);
  assert.match(makerData, /studioName/);
  assert.match(makerData, /contactHref/);
  assert.match(makerData, /contactHref:\s*""/);
  assert.match(makerData, /MAKER_CONTACT_HREF/);
  assert.match(makerData, /contactLabel:\s*"Contact the maker"/);
  assert.doesNotMatch(makerData, /nodarknights\.com/i);
  assert.doesNotMatch(makerData, /paul@oddlytrue\.ai/i);
  assert.doesNotMatch(makerData, /Example listing|offerLabel:\s*"Gift"/i);
  assert.match(
    makerData,
    /Never ask a learner for a full name, personal email/i,
  );

  assert.equal(profileModule.makerProfile.contactHref, "");
  assert.match(
    lightsHtml,
    /This learner site does not publish contact information[\s\S]*parent, guardian, teacher, or program/i,
  );
});

test("Learn prompts protect private photos and keep learner contact disabled", async () => {
  const { optionalPromptCards, promptCards } =
    await import("../app/site-data.ts");
  const { buildSetupPrompt, getSetupPromptSentence, learnerSetups } =
    await import("../app/learner-setup.ts");
  const stepThree = promptCards.find((card) => card.stage === "Step 3");

  assert.equal(promptCards.length, 8);
  assert.equal(learnerSetups.length, 3);
  assert.ok(stepThree);
  assert.match(
    stepThree.prompt,
    /Contact remains disabled by default in every repository clone/i,
  );
  assert.match(stepThree.prompt, /Adult maker: contact is optional/i);
  assert.match(
    stepThree.prompt,
    /valid mailto: address or a secure HTTPS contact page/i,
  );
  assert.match(
    stepThree.prompt,
    /Show me the public label and exact destination before changing anything/i,
  );
  assert.match(
    stepThree.prompt,
    /supported hosting environment configuration instead of committing contact information/i,
  );
  assert.match(
    stepThree.prompt,
    /Stop for my confirmation before changing Sites environment configuration or deploying/i,
  );
  assert.match(
    stepThree.prompt,
    /Young maker with an adult:[\s\S]*do not ask for the young maker’s or parent’s email address/i,
  );
  assert.match(
    stepThree.prompt,
    /This learner site does not publish contact information\. Please contact the maker through their parent, guardian, teacher, or program\./i,
  );
  assert.match(stepThree.prompt, /Do not create a fake or example email link/i);
  assert.match(
    stepThree.prompt,
    /School, library, or makerspace:[\s\S]*organization-managed email/i,
  );
  assert.match(
    stepThree.prompt,
    /Never request or publish a student’s contact information/i,
  );
  assert.match(
    stepThree.prompt,
    /Do not ask me for a full name, personal email, phone number, address, school, social account, contact link, or a parent’s email except for the optional adult-managed or organization-managed contact described above/i,
  );
  const requestedPersonalization =
    stepThree.prompt.match(/Ask me for:([\s\S]*?)\n\nKeep maker/i)?.[1] ?? "";
  assert.doesNotMatch(
    requestedPersonalization,
    /full name|personal email|phone number|address|school|social account|contact link|parent’s email/i,
  );

  for (const setup of learnerSetups) {
    const setupSentence = getSetupPromptSentence(setup.id);
    assert.equal(setupSentence, setup.promptSentence);

    for (const card of promptCards) {
      const copiedPrompt = buildSetupPrompt(card.prompt, setup.id);
      assert.equal(copiedPrompt, `${setup.promptSentence}\n\n${card.prompt}`);
      assert.equal(
        copiedPrompt.split(setup.promptSentence).length - 1,
        1,
        `${setup.label} guidance should appear exactly once`,
      );
    }
  }

  for (const card of [...promptCards, ...optionalPromptCards]) {
    assert.match(
      card.prompt,
      /Never open, read, attach, upload, or analyze my private source photograph/i,
    );
    assert.match(
      card.prompt,
      /I or my supervising adult will visually check the photograph/i,
    );
    assert.match(
      card.prompt,
      /inspect the generated STL, recorded settings, automated tests, and geometry/i,
    );
    assert.match(
      card.prompt,
      /Automated tests must use a neutral image provided by the project/i,
    );
    assert.match(
      card.prompt,
      /Giving a photograph to an AI agent is a separate action/i,
    );
  }

  const learnPageSource = await readFile(
    new URL("../app/learn/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(learnPageSource, /useState<LearnerSetupId \| null>\(null\)/);
  assert.doesNotMatch(
    learnPageSource,
    /localStorage|sessionStorage|document\.cookie|fetch\(|sendBeacon|analytics|database/i,
  );
});

test("maker contact links accept safe email or web destinations", async () => {
  const { getMailtoAddress, isValidContactHref } =
    await import("../app/maker-profile.ts");

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

  const previousHref = process.env.MAKER_CONTACT_HREF;
  const previousLabel = process.env.MAKER_CONTACT_LABEL;
  process.env.MAKER_CONTACT_HREF = "mailto:adult@example.org";
  process.env.MAKER_CONTACT_LABEL = "Ask the adult manager";
  const configured = (
    await import("../app/maker-profile.ts")
  ).getMakerProfile();
  assert.equal(configured.contactHref, "mailto:adult@example.org");
  assert.equal(configured.contactLabel, "Ask the adult manager");
  if (previousHref === undefined) delete process.env.MAKER_CONTACT_HREF;
  else process.env.MAKER_CONTACT_HREF = previousHref;
  if (previousLabel === undefined) delete process.env.MAKER_CONTACT_LABEL;
  else process.env.MAKER_CONTACT_LABEL = previousLabel;
});

test("keeps STL generation local and removes starter UI", async () => {
  const [studio, geometry, homePage, studioPage, packageJson, worker] =
    await Promise.all([
      readFile(new URL("../app/LithophaneStudio.tsx", import.meta.url), "utf8"),
      readFile(
        new URL("../app/lithophane-geometry.ts", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/studio/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    ]);

  assert.match(studio, /createImageBitmap/);
  assert.match(studio, /STLExporter/);
  assert.match(studio, /new Blob/);
  assert.doesNotMatch(studio, /\bfetch\s*\(/);
  assert.match(studio, /"lithophane\.stl"/);
  assert.doesNotMatch(studio, /safeFilename|image\.name/);
  assert.match(studio, /Photo ready/);
  assert.match(geometry, /computeVertexNormals/);
  assert.match(geometry, /geometry\.setIndex/);
  assert.match(homePage, /<SiteShell>/);
  assert.match(studioPage, /<LithophaneStudio \/>/);
  assert.match(packageJson, /"three"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(packageJson, /drizzle|db:generate/);
  assert.match(worker, /Content-Security-Policy/);
  assert.match(worker, /Permissions-Policy/);
  assert.doesNotMatch(worker, /\bDB:\s*D1Database/);
  assert.deepEqual(await readdir(previewRoot), []);
  await assert.rejects(access(new URL("../db/index.ts", import.meta.url)));
  await assert.rejects(
    access(new URL("../app/chatgpt-auth.ts", import.meta.url)),
  );
  await access(
    new URL("../public/no-dark-nights-social-v2.png", import.meta.url),
  );
  await access(new URL(".openai/hosting.json", templateRoot));
});

test("keeps every gallery image inside an equal frame", async () => {
  const [homePage, galleryPage, siteChrome, studio, styles] = await Promise.all(
    [
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/gallery/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/SiteChrome.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/LithophaneStudio.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    ],
  );

  assert.match(homePage, /className="gallery-image-frame"/);
  assert.match(galleryPage, /className="gallery-image-frame"/);
  assert.match(
    styles,
    /\.gallery-image-frame\s*\{[^}]*aspect-ratio:\s*4\s*\/\s*5/s,
  );
  assert.match(
    styles,
    /\.gallery-image-frame img\s*\{[^}]*object-fit:\s*contain/s,
  );
  assert.doesNotMatch(
    `${siteChrome}${studio}`,
    /brand-mark|brand-moon|brand-lamp/,
  );
  assert.match(siteChrome, /className="brand-dot"/);
  assert.match(studio, /className="brand-dot"/);
  assert.match(styles, /a:focus-visible[\s\S]{0,240}outline:\s*3px solid/i);
  assert.match(styles, /\.ndn-nav\s*\{[\s\S]*?overflow-x:\s*auto/s);
});
