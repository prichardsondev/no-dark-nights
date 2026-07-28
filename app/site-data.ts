export const REPOSITORY_URL =
  "https://github.com/prichardsondev/no-dark-nights";

export const navigation = [
  { href: "/lights", label: "Lights", primary: true },
  { href: "/studio", label: "Studio", primary: true },
  { href: "/learn", label: "Learn", primary: true },
  { href: "/gallery", label: "Gallery", primary: false },
  { href: "/resources", label: "Resources", primary: false },
  { href: "/code", label: "Code", primary: false },
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
    title: "Download and run",
    summary:
      "Use Codex to copy the project, open the right folder, and start the website on your computer.",
    teaches: "How a project moves from GitHub to a local folder you can use.",
    needs: "Your setup checklist complete and the project link below.",
    stopPoints:
      "Stop for sign-in, installation, folder-choice, or permission requests.",
    inspect:
      "Find the project folder, see the local homepage, and read the address in the browser.",
    deliverable: "The No Dark Nights website running on your computer.",
    reflection: "What does “local” mean, and where is your project folder?",
  },
  {
    number: "02",
    title: "Understand the project",
    summary:
      "Take a guided tour of the important files and unfamiliar words before editing anything.",
    teaches: "How pages, data files, the Studio, and tests fit together.",
    needs: "The project running locally from Step 1.",
    stopPoints: "Do not edit files during this tour.",
    inspect:
      "Open the files Codex names and compare its project map with what you see.",
    deliverable: "A short project map you understand.",
    reflection:
      "Which file would you edit first, and which geometry files need extra care?",
  },
  {
    number: "03",
    title: "Personalize your site",
    summary:
      "Replace the sample identity, maker information, lights, permitted gallery content, words, and colors while protecting the Studio.",
    teaches:
      "How content, design choices, privacy, and reusable data work together.",
    needs:
      "Your project map, an adult-controlled contact choice, and permission for every image you may publish.",
    stopPoints:
      "Stop before publishing contact details or photographs; a trusted adult must review them.",
    inspect:
      "Check the homepage, Lights, Gallery, phone layout, and every image, title, and description.",
    deliverable: "A personalized site with reviewed maker information.",
    reflection:
      "How does your version show who made it without revealing private information?",
  },
  {
    number: "04",
    title: "Save with Git and GitHub",
    summary:
      "Review the changes, save a clear local Git commit, and push it to your own GitHub repository only after checking for private information.",
    teaches: "How Git records a checkpoint and GitHub stores a remote copy.",
    needs:
      "Your personalized site, a learner GitHub account or approved school repository, and adult or teacher approval when required.",
    stopPoints:
      "Stop for GitHub sign-in, repository visibility, permission, secret, or merge-conflict decisions.",
    inspect:
      "Read the changed-file list, commit message, repository visibility, and the files shown on GitHub.",
    deliverable: "A reviewed commit safely saved to your GitHub repository.",
    reflection:
      "What did your commit save, and what information did you keep out of GitHub?",
  },
  {
    number: "05",
    title: "Create a lithophane STL",
    summary:
      "Choose a permitted photo, measure your light, frame the image, inspect the preview, and download a local STL.",
    teaches: "How image choices and real measurements become printable geometry.",
    needs:
      "A photo you may use, a ruler or calipers, and the night-light housing you plan to fit.",
    stopPoints:
      "Do not upload or publish the source photo. Stop instead of guessing an unknown measurement.",
    inspect:
      "Check framing, size, slot width, orientation, optional bottom text, and the saved settings note.",
    deliverable: "Your first custom lithophane STL.",
    reflection: "Which photo or measurement adjustment changed the model most?",
  },
  {
    number: "06",
    title: "Test the website and STL",
    summary:
      "Run the complete project checks, inspect every important page, and verify the STL before anything is published or printed.",
    teaches: "How automated checks and human inspection catch different problems.",
    needs:
      "Your personalized site, downloaded STL, settings note, and source image.",
    stopPoints:
      "Do not change geometry just to silence a test; investigate and explain a real failure first.",
    inspect:
      "Review pages on desktop and phone, keyboard use, privacy text, dimensions, mesh closure, orientation, and slicer preview.",
    deliverable: "A passing website and STL validation report.",
    reflection:
      "Which problem could a person see that an automated test might miss?",
  },
  {
    number: "07",
    title: "Publish a private review",
    summary:
      "Use Sites only when it is available to your account, then create a private review link for a trusted adult or teacher.",
    teaches: "How deployment turns local files into a reviewable website.",
    needs:
      "Passing checks, a reviewed GitHub repository, and either eligible Sites access or an instructor who can publish the approved preview.",
    stopPoints:
      "Stop for account, workspace, access-level, permission, or public-publishing decisions. Do not connect a real domain.",
    inspect:
      "Open every deployed route and confirm the deployment is private before sharing its link.",
    deliverable:
      "A private review link, or a complete local and GitHub version if Sites is unavailable.",
    reflection:
      "What is different between your local site, GitHub repository, and deployed preview?",
  },
  {
    number: "08",
    title: "Fit-test, print, share, and reflect",
    summary:
      "Verify the model in your slicer, test the adapter fit, print safely, and share only a privacy-safe result.",
    teaches:
      "How digital design becomes a tested physical object through iteration.",
    needs:
      "A validated STL, compatible slicer and printer, measured light, materials, and adult guidance where appropriate.",
    stopPoints:
      "Stop for unsafe tool use, electrical changes, a poor fit, damaged print, or any photo that reveals private information.",
    inspect:
      "Preview toolpaths, test the adapter, inspect the cooled print, verify the unplugged housing fit, and follow manufacturer guidance.",
    deliverable: "A working night light and a story you can share.",
    reflection: "What worked, what did you change, and what would you try next?",
  },
];

export const promptCards = [
  {
    title: "Download and open the project",
    stage: "Step 1",
    purpose: "Gets the code onto your computer and starts the website.",
    prompt: `I want to build the No Dark Nights project.

Original site: https://nodarknights.com

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

Do not change the project yet. If you need me to sign in, choose a folder, install software, or approve a permission, stop and tell me exactly what to do. An adult should handle accounts, installations, permissions, and publishing when appropriate.

We are finished when I can see the No Dark Nights homepage and you tell me where the project folder is.`,
  },
  {
    title: "Understand the project",
    stage: "Step 2",
    purpose: "Takes you on a plain-language tour before you edit anything.",
    prompt: `Help me understand this No Dark Nights project before I change it.

I am a beginner. First inspect the project, including the website pages, the maker profile data, the code that creates the 3D model, and the tests.

Do not edit files yet. Explain unfamiliar words in plain language. Show me:
- which file controls each page;
- where the maker and light information lives;
- which files are safe to personalize;
- which 3D-model files need extra care;
- how the tests protect the project.

Finish with a short project map and three safe changes I could make first. Ask me to explain one part back to you so we know I understood it.`,
  },
  {
    title: "Personalize the site",
    stage: "Step 3",
    purpose: "Replaces the samples while protecting the working Studio.",
    prompt: `Help me personalize this website so it clearly belongs to its maker.

Keep the lithophane maker working. I am a beginner, so explain the files you edit.

Ask me for:
- the site or studio name;
- the maker name I have permission to publish;
- a short introduction;
- an adult-controlled contact link and label;
- the homepage words and color direction;
- each light listing’s image, title, and short description;
- permitted gallery images and privacy-safe captions.

Keep maker and light information in app/maker-profile.ts. Clearly mark anything I have not replaced as a sample. Before any public release, require me to replace every sample listing or intentionally remove it.

Do not publish a child’s email, phone number, school, home address, full name, or location clues. Use only images I confirm I may publish. Keep the homepage’s three paths, the compact design, keyboard access, phone layout, source-photo privacy, and all lithophane geometry unchanged.

Run the relevant checks. Show me the personalized pages, remaining sample content, files changed, and one design choice in plain words. We are finished when a trusted adult has reviewed the maker information and every image intended for publishing.`,
  },
  {
    title: "Save your work with Git and GitHub",
    stage: "Step 4",
    purpose: "Creates a safe checkpoint and remote copy of the personalized site.",
    prompt: `Help me safely save my personalized No Dark Nights project with Git and GitHub.

I am a beginner. Explain that Git records changes in my project and GitHub can store a copy online. Do not publish anything until I understand what will happen.

Please:
1. Read AGENTS.md and check the current Git status and remote repository.
2. Show me every changed and new file in plain language.
3. Check for passwords, API keys, .env files, local configuration, downloads, build output, private photographs, names, contact details, school information, addresses, or location clues that should not be committed.
4. Confirm that only permitted public images are included and that sample listings are still clearly labeled if any remain.
5. Run the project checks before saving.
6. Propose a short commit message that says what changed.
7. Stop and ask before staging or committing if any private, generated, unexplained, or unrelated file is present.
8. Create the local commit only after the review is clean.
9. Confirm which GitHub account, repository, branch, and public/private visibility will be used. Stop for sign-in, repository creation, visibility, permissions, merge conflicts, or any choice I should make.
10. Push only the reviewed commit. Never force-push, delete history, expose credentials, or change a repository’s visibility without explicit adult approval.
11. Open or show the GitHub repository and confirm the intended files and commit are there.

We are finished when the clean commit is on the intended GitHub repository, I know its visibility, and I can explain the difference between Git and GitHub.`,
  },
  {
    title: "Create your lithophane STL",
    stage: "Step 5",
    purpose: "Turns a permitted photo into a measured, printable model.",
    prompt: `Help me create my first custom lithophane STL with the local No Dark Nights website.

I am a beginner, so guide me one small step at a time and explain unfamiliar words. Use the project’s Resources page for parts and printing guidance.

Before we begin:
1. Ask me to confirm that I took the photograph or have permission to use it.
2. Explain briefly that clear, well-lit images with good contrast and an obvious subject usually work best.
3. Keep the photograph on my computer. Do not upload, publish, commit, or add it to the repository.

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
    title: "Test the website and STL",
    stage: "Step 6",
    purpose: "Checks the public experience and printable model before release.",
    prompt: `Test my No Dark Nights website and lithophane STL before I publish or print them.

I am a beginner. Explain each check and do not hide failures. Read AGENTS.md first. Do not change the lithophane geometry unless a test proves a real problem and you explain it to me.

Website checks:
1. Run lint, type-check, build, page tests, WebGL fallback tests, and all geometry/STL tests.
2. Open the homepage, Lights, Studio, Learn, Gallery, Resources, Code, and About pages.
3. Check desktop and phone layouts, navigation, headings, links, keyboard focus, contrast, image framing, and horizontal overflow.
4. Confirm the homepage still has the three clear paths and “Make one. Give one. Teach one.”
5. Confirm the Lights page belongs to this maker, sample listings are honest, and contact is adult-controlled.
6. Confirm source photos remain local, WebGL failure cannot crash the Studio, bottom text works, and STL download remains available.
7. Check that every photo and caption has permission and does not expose private information.

STL checks:
1. Use my source image, downloaded STL, and settings note without uploading or publishing the source image.
2. Verify image direction, height, width, slot width, curve, adapter thickness, bottom text, and build-plate orientation.
3. Check for a closed manifold mesh, outward-facing triangles, duplicate or degenerate triangles, open edges, and unexpected size.
4. Open the STL in my slicer and inspect the first layers, rounded slot, adapter, panel transition, and full toolpath preview.
5. Compare measurements with my actual night-light housing and the Resources guidance. Do not invent universal printer settings.

Fix only clear website problems that are safe and in scope, then rerun affected checks. Stop before changing geometry, publishing, committing a private image, or making a decision that requires me or an adult.

Finish with a table of pass, needs work, or not tested for every check; evidence for each result; anything I must inspect myself; and a clear overall release and print readiness decision.

We are finished when the complete automated suite passes and the website and STL have passed the human checks, or when every remaining blocker is clearly listed.`,
  },
  {
    title: "Publish a private review",
    stage: "Step 7",
    purpose: "Creates a trusted review link when Sites is available.",
    prompt: `Prepare a private review version of my No Dark Nights site with Sites.

I am a beginner. First explain that Sites turns the tested project into a hosted preview. Check how my local Codex is authenticated and whether Sites is available for my account and workspace; availability can depend on the account, plan, workspace settings, and administrator.

Please:
1. Confirm the GitHub commit from the previous steps and rerun the required release checks.
2. Stop and ask a trusted adult or teacher to approve publishing and review the intended audience.
3. Preserve the existing Sites project identity if this project already has one. Never create a duplicate deployment project silently.
4. Prepare a private, owner-only review version. Before deploying, show me the resolved access level and ask for approval.
5. Do not make the site public, connect or change a real domain, add analytics, or expose private photographs or contact details.
6. After deployment, open the homepage, Lights, Studio, Learn, Gallery, Resources, Code, and About pages and verify the main desktop and phone layouts and links.
7. Give me the private link and a short adult review checklist.

If I use Bedrock-only authentication, recognize that it supports local Codex work but not OpenAI-hosted Sites. Do not keep retrying Sites and do not ask me for AWS credentials. Preserve the completed local website and approved GitHub repository. If an instructor has eligible ChatGPT and Sites access, prepare a clear handoff so the instructor can separately review and publish an approved preview.

If Sites is otherwise unavailable, do not pretend the deployment succeeded or choose another public host. Keep the completed project local and on the approved GitHub repository, explain what is unavailable, and give me a checklist for trying again with an adult or workspace administrator.

Publishing is optional. We are finished when a trusted adult has an approved private review link, or when the fully tested local website and approved GitHub repository are safely saved and the Sites limitation is documented.`,
  },
  {
    title: "Slice, fit-test, print, and share",
    stage: "Step 8",
    purpose: "Checks the fit and guides the model safely from slicer to light.",
    prompt: `Help me turn my finished lithophane STL into a working night light.

I am a beginner. Guide me carefully, explain slicer terms in plain language, and involve a trusted adult where appropriate. Do not assume one printer profile or one set of slicer settings works for every machine.

Please help me:
1. Open the STL in the slicer for my actual 3D printer.
2. Verify the model height, width, slot width, and orientation against the settings note and my measured night-light housing.
3. Confirm that the adapter base sits flat on the build plate and the lithophane stands in the intended upright printing orientation.
4. Preview the first layers, the rounded slot, the adapter area, and the transition into the picture panel. Point out gaps, unsupported areas, or surprising toolpaths.
5. Compare my choices with the No Dark Nights Resources page and its “What We Use” links, while treating them as examples rather than purchasing requirements or universal settings.
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
