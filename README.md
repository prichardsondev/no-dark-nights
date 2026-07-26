# No Dark Nights

Make a night light from a photo, learn how the website works, and build your
own version with Codex.

No Dark Nights is a free prompt-to-product learning project for kids, families,
classrooms, and curious adults. It includes:

- a browser-based image-to-lithophane maker;
- a printable night-light STL generator;
- a guided learning path;
- beginner-friendly Codex prompts;
- geometry and page tests;
- practical printing and privacy guidance.

**Live private preview:** [no-dark-nights-studio.prichardsondev.chatgpt.site](https://no-dark-nights-studio.prichardsondev.chatgpt.site)

**Public source:** [github.com/prichardsondev/no-dark-nights](https://github.com/prichardsondev/no-dark-nights)

## Start here

You do not need to understand the code before you begin.

### Option A: Ask Codex to set it up

Open Codex and paste this:

```text
I want to build the No Dark Nights project.

Project link: https://github.com/prichardsondev/no-dark-nights

I am a beginner, so please explain each step in simple words.

Please clone the project, read README.md and AGENTS.md, install what it needs,
start the local website, and open it for me. Do not change the project yet.
Stop and tell me exactly what to do if you need me to sign in, choose a folder,
or approve something.
```

### Option B: Run it yourself

You need [Node.js](https://nodejs.org/) version 22.13 or newer.

```bash
git clone https://github.com/prichardsondev/no-dark-nights.git
cd no-dark-nights
npm install
npm run dev
```

Open the local address printed in the terminal.

## Make a lithophane

1. Open `/studio`.
2. Choose a JPG, PNG, WebP, AVIF, GIF, HEIC, or HEIF image.
3. Frame the image and measure the slot on your night-light housing.
4. Inspect the preview when WebGL is available.
5. Download the STL and verify it in your slicer.
6. Print a small adapter fit test before a full print.

Source photos stay on the device. The STL generator does not require WebGL, so
STL creation remains available when the interactive preview cannot run.

The default slot width is 16.5 mm. Measure your own housing before printing.

## Project map

```text
no-dark-nights/
├── app/                 website, studio, and STL engine
├── tests/               geometry, resilience, and page checks
├── examples/            rules for shareable examples
├── public/gallery/      displayed images with separate rights
├── AGENTS.md            guidance for Codex and contributors
├── CONTRIBUTING.md      how to propose a change
├── SECURITY.md          privacy and security reporting
└── README.md            start here
```

## Useful commands

```bash
npm run dev      # run the local website
npm run build    # create the production build
npm run lint     # check code style and common mistakes
npm test         # build and run all automated checks
```

## Routes

- `/` — project home
- `/studio` — local image-to-STL studio
- `/learn` — seven-stage learning path with a Codex prompt for every step
- `/prompts` — redirects old links to the first Learn step
- `/gallery` — finished lights
- `/resources` — printer, material, light, and slicer guidance
- `/code` — source-code map and repository link
- `/about` — mission and project story

## Privacy and safety

- Source photos are processed locally in the browser.
- Do not publish names, school details, addresses, or personal photographs
  without permission.
- A trusted adult should review publishing and plug-in light choices.
- Always inspect an STL in a slicer before printing.
- Keep printed parts and plug-in lights away from excess heat.

See [SECURITY.md](SECURITY.md) for reporting and privacy details.

## License and gallery rights

The software and documentation are available under the [MIT License](LICENSE).

Personal and gallery photographs are **not** covered by the MIT License. They
remain copyrighted by their respective owners and are displayed only with
permission. See [public/gallery/README.md](public/gallery/README.md).

Make one. Give one. Teach one.
