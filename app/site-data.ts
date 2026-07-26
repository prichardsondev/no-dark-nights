export const navigation = [
  { href: "/studio", label: "Make" },
  { href: "/learn", label: "Learn" },
  { href: "/prompts", label: "Prompts" },
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

Project link: [PASTE THE GITHUB PROJECT LINK HERE]

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
    title: "Add a project story",
    stage: "Make it yours",
    purpose: "Adds a finished light without exposing private information.",
    prompt: `Add a new gallery story for a night light I made.

I will provide a photograph of the finished light and tell you what inspired it.

Do not publish names, addresses, school details, or other private information. Use the image only after I confirm I have permission to share it. Match the existing gallery style and image size.

Finish when the entry has useful image description text, a short natural caption, and looks good beside the other gallery images and on a phone.`,
  },
  {
    title: "Test an image",
    stage: "Check the model",
    purpose: "Asks Codex to inspect the hard 3D-printing details for you.",
    prompt: `Check whether this image and STL will create a good lithophane.

I attached the source image and the STL made by the studio.

Please inspect the direction of the image, model dimensions, slot width, closed edges, triangle direction, and how well the thickness follows the picture. Explain each term when you use it. Do not change the model code unless you find a real problem.

Finish with a clear pass or needs-work result, evidence for each check, and the print settings I should verify in my slicer.`,
  },
  {
    title: "Publish a private review",
    stage: "Share safely",
    purpose: "Creates a review link without changing a real domain.",
    prompt: `Prepare and publish a private review version of my site with Sites.

I want an adult or teacher to review it before it becomes public.

Run the build and tests first. Check every navigation link and the main phone layout. Do not connect or change a real domain.

Finish when the private deployment succeeds. Give me its link and a short checklist an adult can use to review it.`,
  },
  {
    title: "Improve one thing",
    stage: "Try again",
    purpose: "Keeps follow-up changes small enough to understand.",
    prompt: `Help me improve one part of my project without making it more complicated.

First inspect the current page. Ask me what feels confusing, slow, or unfinished.

Choose the smallest useful change. Keep the lithophane download working. Add or update a test if this change could break later.

Finish when the improvement works, the checks pass, and I can explain what changed in my own words.`,
  },
];
