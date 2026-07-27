export const REPOSITORY_URL =
  "https://github.com/prichardsondev/no-dark-nights";

export const navigation = [
  { href: "/studio", label: "Make" },
  { href: "/learn", label: "Learn" },
  { href: "/gallery", label: "Gallery" },
  { href: "/resources", label: "Resources" },
  { href: "/code", label: "Code" },
];

export const galleryItems = [
  {
    src: "/gallery/our-moment.jpg",
    title: "Our Moment",
    alt: "A warm glowing lithophane night light showing a couple",
  },
  {
    src: "/gallery/fawn-light.jpg",
    title: "Fawning Intelligence",
    alt: "A glowing lithophane night light showing a young deer",
  },
  {
    src: "/gallery/timeless-vows.jpg",
    title: "Timeless Vows",
    alt: "A lithophane night light made from a vintage wedding photograph",
  },
  {
    src: "/gallery/owl-light.jpg",
    title: "What a Hoot",
    alt: "A glowing lithophane night light showing an owl",
  },
  {
    src: "/gallery/truck-light.jpg",
    title: "That’s a Nightlight",
    alt: "A lithophane night light showing a pickup truck",
  },
  {
    src: "/gallery/winter-wonderland.jpg",
    title: "Winter Wonderland",
    alt: "A warm lithophane night light showing a snowy cabin",
  },
  {
    src: "/gallery/amber-light.jpg",
    title: "Amber Light",
    alt: "An amber illuminated lithophane night light showing a puppy",
  },
  {
    src: "/gallery/soft-white-light.jpg",
    title: "Soft White Light",
    alt: "A soft white illuminated lithophane night light showing a puppy",
  },
];

export const learningSteps = [
  {
    number: "01",
    title: "Get the project",
    summary:
      "Copy the first starter prompt into Codex. It will help you download the project, open the right folder, and start the website.",
    deliverable: "The No Dark Nights website running on your computer.",
  },
  {
    number: "02",
    title: "Ask how it works",
    summary:
      "Use the project tour prompt. Codex will show you the important files and explain the unfamiliar words before you edit anything.",
    deliverable: "A short project map you understand.",
  },
  {
    number: "03",
    title: "Make the site yours",
    summary:
      "Change the name, colors, words, and story. Keep the working lithophane math protected while you learn.",
    deliverable: "A personalized homepage you can explain.",
  },
  {
    number: "04",
    title: "Make a lithophane",
    summary:
      "Choose a photo, inspect the 3D preview, measure your light, and download an STL. Ask an adult before sharing a personal photo.",
    deliverable: "Your first custom lithophane STL.",
  },
  {
    number: "05",
    title: "Test your work",
    summary:
      "Ask Codex to run the project checks and open the pages in a browser. Fix one clear problem at a time.",
    deliverable: "A passing test report and pages you have checked yourself.",
  },
  {
    number: "06",
    title: "Share a private preview",
    summary:
      "Use Sites to publish an owner-only version. Let an adult or teacher review it before connecting a public domain.",
    deliverable: "A private review link.",
  },
  {
    number: "07",
    title: "Print and share the light",
    summary:
      "Confirm the measurements in your slicer, print a small fit test, then make the full light with adult help.",
    deliverable: "A working night light and a story you can share.",
  },
];

export const promptCards = [
  {
    title: "Download and open the project",
    stage: "Step 1",
    purpose: "Gets the code onto your computer and starts the website.",
    prompt: `I want to build the No Dark Nights project.

Project link: https://github.com/prichardsondev/no-dark-nights

I am a beginner, so please explain each step in simple words.

Please:
1. Check that the project link works.
2. Download or clone the project into a new folder.
3. Open that folder as my Codex workspace.
4. Read the README and AGENTS.md files.
5. Install what the project needs.
6. Start the website on my computer.
7. Open the local website so I can see it.

Do not change the project yet. If you need me to sign in, choose a folder, or approve something, stop and tell me exactly what to do.

We are finished when I can see the No Dark Nights homepage and you tell me where the project folder is.`,
  },
  {
    title: "Understand the project",
    stage: "Step 2",
    purpose: "Takes you on a plain-language tour before you edit anything.",
    prompt: `Help me understand this No Dark Nights project before I change it.

I am a beginner. First inspect the project, including the website pages, the code that creates the 3D model, and the tests.

Do not edit files yet. Explain unfamiliar words in plain language. Show me:
- which file controls each page;
- which files are safe to personalize;
- which 3D-model files need extra care;
- how the tests protect the project.

Finish with a short project map and three safe changes I could make first. Ask me to explain one part back to you so we know I understood it.`,
  },
  {
    title: "Personalize the site",
    stage: "Step 3",
    purpose: "Changes the identity while protecting the working maker.",
    prompt: `Help me personalize this website so it feels like my project.

Keep the lithophane maker working. I want to change the name, colors, homepage words, and gallery captions.

Ask me no more than five short questions first. Then make one focused version using my answers.

Keep the layout simple and compact. Do not create a giant headline or marketing-style landing page. Keep it usable with a keyboard and on a phone.

Finish when the build passes. Show me the page, list the files you changed, and explain one design choice in plain words.`,
  },
  {
    title: "Create your lithophane STL",
    stage: "Step 4",
    purpose: "Turns a permitted photo into a measured, printable model.",
    prompt: `Help me create my first custom lithophane STL with the local No Dark Nights website.

I am a beginner, so guide me one small step at a time and explain unfamiliar words.

Before we begin:
1. Ask me to confirm that I took the photograph or have permission to use it.
2. Explain briefly that clear, well-lit images with good contrast and an obvious subject usually work best.
3. Keep the photograph on my computer. Do not upload, publish, or add it to the repository.

Then help me:
1. Start the local No Dark Nights website if it is not already running.
2. Open the Studio page.
3. Measure or verify the height, width, and slot width of my night-light housing. If I do not know a measurement, stop and help me find it instead of guessing.
4. Choose the closest size preset, then adjust the measurements only if my housing requires it.
5. Select the photograph and frame the important part. Help me check zoom, position, contrast, and invert only when useful.
6. Inspect the interactive 3D preview. If WebGL is unavailable, use the photo framing view and continue because STL generation should still work.
7. Ask whether I want optional text raised on the bottom adapter, such as a first name or short message. Do not add private information unless I choose it.
8. Download the printable STL.
9. Record the source image filename, model height, model width, slot width, curve radius, adapter thickness, chosen preset, photo adjustments, and optional adapter text in a short settings note. Do not copy the photograph itself into the project.

We are finished when the STL is downloaded, the important measurements have been checked, and I have a settings note I can use again.`,
  },
  {
    title: "Test an image",
    stage: "Step 5",
    purpose: "Asks Codex to inspect the hard 3D-printing details for you.",
    prompt: `Check whether this image and STL will create a good lithophane.

I attached the source image and the STL made by the studio.

Please inspect the direction of the image, model dimensions, slot width, closed edges, triangle direction, and how well the thickness follows the picture. Explain each term when you use it. Do not change the model code unless you find a real problem.

Finish with a clear pass or needs-work result, evidence for each check, and the print settings I should verify in my slicer.`,
  },
  {
    title: "Publish a private review",
    stage: "Step 6",
    purpose: "Creates a review link without changing a real domain.",
    prompt: `Prepare and publish a private review version of my site with Sites.

I want an adult or teacher to review it before it becomes public.

Run the build and tests first. Check every navigation link and the main phone layout. Do not connect or change a real domain.

Finish when the private deployment succeeds. Give me its link and a short checklist an adult can use to review it.`,
  },
  {
    title: "Slice, fit-test, print, and share",
    stage: "Step 7",
    purpose: "Checks the fit and guides the model safely from slicer to light.",
    prompt: `Help me turn my finished lithophane STL into a working night light.

I am a beginner. Guide me carefully, explain slicer terms in plain language, and involve a trusted adult where appropriate. Do not assume one printer profile or one set of slicer settings works for every machine.

Please help me:
1. Open the STL in the slicer for my actual 3D printer.
2. Verify the model height, width, slot width, and orientation against the settings note and my measured night-light housing.
3. Confirm that the adapter base sits flat on the build plate and the lithophane stands in the intended upright printing orientation.
4. Preview the first layers, the rounded slot, the adapter area, and the transition into the picture panel. Point out gaps, unsupported areas, or surprising toolpaths.
5. Compare my choices with the No Dark Nights Resources page, while treating its values as starting guidance rather than universal settings.
6. If this is a new housing, uncertain measurement, or changed adapter, help me create or slice a small adapter-only fit test before the full print.
7. Check the cooled fit test on the unplugged light housing. If it is too tight or loose, return to the Studio measurements and make a corrected STL before continuing.
8. Prepare and print the complete lithophane with adult guidance where appropriate, following the printer and material manufacturers’ instructions.
9. Inspect the cooled finished print for cracks, sharp edges, poor layer bonding, blocked openings, or a bad fit before using it with the light.
10. Follow the light manufacturer’s instructions and the project’s safety guidance. Keep the print away from excess heat and do not modify the electrical parts.
11. Help me photograph or describe the finished result without showing names, addresses, school details, location clues, or other private information.
12. Ask me to write two or three sentences about what worked, what I changed, and what I learned.

We are finished when the fit has been verified, the complete print has been safely inspected, and I have a privacy-safe result and short learning note to share.`,
  },
];

export const optionalPromptCards = [
  {
    title: "Add a project story",
    stage: "Optional",
    purpose: "Adds a finished light without exposing private information.",
    prompt: `Add a new gallery story for a night light I made.

I will provide a photograph of the finished light and tell you what inspired it.

Do not publish names, addresses, school details, or other private information. Use the image only after I confirm I have permission to share it. Match the existing gallery style and image size.

Finish when the entry has useful image description text, a short natural caption, and looks good beside the other gallery images and on a phone.`,
  },
  {
    title: "Improve one thing",
    stage: "Optional",
    purpose: "Keeps follow-up changes small enough to understand.",
    prompt: `Help me improve one part of my project without making it more complicated.

First inspect the current page. Ask me what feels confusing, slow, or unfinished.

Choose the smallest useful change. Keep the lithophane download working. Add or update a test if this change could break later.

Finish when the improvement works, the checks pass, and I can explain what changed in my own words.`,
  },
];
