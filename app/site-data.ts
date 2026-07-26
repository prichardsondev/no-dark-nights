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
    title: "Meet your coding partner",
    summary:
      "Clone the project, open it in Codex, and ask the agent to explain how the website and lithophane engine fit together.",
    deliverable: "A running local copy and your first project note.",
  },
  {
    number: "02",
    title: "Make the site yours",
    summary:
      "Change the name, colors, words, navigation, and story while keeping the working geometry engine protected.",
    deliverable: "A personalized homepage you can explain.",
  },
  {
    number: "03",
    title: "Create the product",
    summary:
      "Choose an image, inspect the real 3D preview, tune the fit, and generate a print-ready STL on your own device.",
    deliverable: "Your first custom lithophane STL.",
  },
  {
    number: "04",
    title: "Test like a developer",
    summary:
      "Ask Codex to run the checks, inspect the changes, and test portrait, landscape, transparent, and unusual images.",
    deliverable: "A passing build and a short test report.",
  },
  {
    number: "05",
    title: "Publish with Sites",
    summary:
      "Build a private version, review it in the browser, and publish only when the page and controls behave as expected.",
    deliverable: "A private link you can share with an adult or teacher.",
  },
  {
    number: "06",
    title: "Print and troubleshoot",
    summary:
      "Slice the model upright, confirm the slot measurement, print a fit test, and improve one setting at a time.",
    deliverable: "A working night light made from your image.",
  },
  {
    number: "07",
    title: "Share the light",
    summary:
      "Photograph the finished light, tell its story, and decide whether to keep it, gift it, or teach someone else.",
    deliverable: "A finished gallery entry and project reflection.",
  },
];

export const promptCards = [
  {
    title: "Understand the project",
    stage: "Start here",
    prompt: `Goal: Help me understand this No Dark Nights project before I change it.

Context: I am learning. Please inspect the repository, especially the website routes, the lithophane geometry engine, and the tests.

Constraints: Do not edit files yet. Explain unfamiliar terms in plain language. Show me which files are safe to personalize and which geometry files need extra care.

Done when: Give me a short project map, the commands to run it locally, and three small changes I could make first.`,
  },
  {
    title: "Personalize the site",
    stage: "Design",
    prompt: `Goal: Personalize this website so it feels like my project.

Context: Keep the lithophane maker working. I want to change the name, colors, homepage words, and gallery captions. Ask me a few useful questions first.

Constraints: Keep the layout clean and compact. Do not create a giant hero or jumbotron. Preserve accessibility and mobile behavior.

Done when: The site reflects my answers, the build passes, and you show me the most important changes.`,
  },
  {
    title: "Add a project story",
    stage: "Content",
    prompt: `Goal: Add a new gallery story for a night light I made.

Context: I will provide a photograph of the finished light and tell you who or what inspired it.

Constraints: Do not publish private information. Use the image only after I confirm I have permission to share it. Match the existing gallery style.

Done when: The new entry has useful alt text, a short human caption, and looks good on mobile.`,
  },
  {
    title: "Test an image",
    stage: "Quality",
    prompt: `Goal: Check whether this image will create a good lithophane.

Context: I attached the source image and the STL generated by the studio.

Constraints: Inspect orientation, dimensions, slot width, manifold edges, face winding, and relief fidelity. Do not change the engine unless you find a real problem.

Done when: Give me a clear pass/fail result, evidence for each check, and any print setting I should verify.`,
  },
  {
    title: "Publish a private review",
    stage: "Launch",
    prompt: `Goal: Prepare and publish a private review version of my site with the Sites plugin.

Context: I want an adult or teacher to review it before it becomes public.

Constraints: Run the build and tests first. Check navigation and the main mobile layout. Do not connect or change a real domain.

Done when: The deployment succeeds and you give me the private review link plus a short checklist of what to inspect.`,
  },
  {
    title: "Improve one thing",
    stage: "Iterate",
    prompt: `Goal: Help me improve one part of my project without making it more complicated.

Context: First inspect the current page and ask what feels confusing, slow, or unfinished to me.

Constraints: Choose the smallest useful change. Preserve the lithophane export behavior. Add or update a test when the change could break later.

Done when: The improvement works, the checks pass, and I can explain what changed in my own words.`,
  },
];

