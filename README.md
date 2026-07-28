# No Dark Nights

Make a night light from a photo, learn how the website works, and build your
own personalized lithophane website with Codex.

No Dark Nights is a free prompt-to-product learning project for kids, families,
classrooms, and curious adults. It includes:

- a browser-based image-to-lithophane maker;
- a printable night-light STL generator;
- a guided learning path;
- beginner-friendly Codex prompts;
- geometry and page tests;
- practical printing and privacy guidance.
- an owner-customizable page for example lights and adult-controlled contact.

**Live site:** [nodarknights.com](https://nodarknights.com)

**Public source:** [github.com/prichardsondev/no-dark-nights](https://github.com/prichardsondev/no-dark-nights)

## Start here

You do not need to understand the code before you begin.

### Set up Codex

Individual learners can install the official
[ChatGPT desktop app](https://chatgpt.com/download/) for macOS or Windows, sign
in, and choose **Codex** from the top-left menu. Codex availability and usage
can depend on the account, plan, workspace settings, and administrator; the
project does not promise free access. The Codex CLI and IDE extension are
optional advanced alternatives.

A school-managed lab can configure local Codex to use supported OpenAI models
through [Amazon Bedrock](https://learn.chatgpt.com/docs/amazon-bedrock).
A teacher or administrator must prepare AWS authentication, access, and
spending controls. Students must never paste AWS credentials into prompts,
source files, committed `.env` files, screenshots, or GitHub. Schools should
use managed, limited, revocable student access rather than root credentials or
permanent shared keys.

Bedrock-only authentication supports the local website, Git, an approved
learner or school-managed GitHub repository, Studio, testing, and printing.
OpenAI-hosted services such as Sites are not available through Bedrock-only
authentication. Publishing is optional; an instructor with eligible ChatGPT
and Sites access may publish an approved preview separately. A tested local
website and approved GitHub repository are valid completion outcomes.

Under 13, an adult must conduct all ChatGPT/Codex interactions. Ages 13–17
require parent or guardian permission. GitHub personal accounts require users
to be at least 13, so under-13 work must use an adult-, teacher-, or
organization-controlled repository. Accounts must not be shared. Follow family
and school policies and read
[OpenAI's current age guidance](https://help.openai.com/en/articles/8313401-is-chatgpt-safe-for-all-ages).

Anyone can use the deployed Studio without Codex. Building a physical light
also requires slicer software and access to a compatible 3D printer. See
[Resources](https://no-dark-nights-studio.prichardsondev.chatgpt.site/resources)
for the parts and tools used by this project.

### Option A: Ask Codex to set it up

Open Codex and paste this:

```text
I want to build the No Dark Nights project.

Original site: https://nodarknights.com

Project link: https://github.com/prichardsondev/no-dark-nights

Never open, read, attach, upload, or analyze my private source photograph. I or
my supervising adult will check it visually inside the Studio. You may inspect
the generated STL, settings, tests, and geometry. Use only the neutral
project-provided image for automated tests.

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
4. Optionally add a nickname, kind word, or short message to the bottom adapter.
5. Inspect the preview when WebGL is available.
6. Download the STL and verify it in your slicer.
7. For a new housing, open the **Base Fit Lab** on the Studio page and download
   one STL containing three small labeled fit coupons.

Source photos stay on the device. The STL generator does not require WebGL, so
STL creation remains available when the interactive preview cannot run.
Never attach a private source photograph to Codex. The learner or supervising
adult checks it visually inside the Studio; automated tests use a neutral
project image.

The Base Fit Lab starts with 16.0, 16.5, and 17.0 mm coupons. Print them flat,
let them cool, unplug the light, and try the 16.5 mm center coupon first. Pick
the snug size that slides on without force or wobble, then use its button to
change only the Studio slot width. The default slot width remains 16.5 mm.
Printer tuning, material, shrinkage, and housing shape can affect real fit, so
this physical test is more useful than guessing a measurement.

## Project map

```text
no-dark-nights/
├── app/                 website, studio, and STL engine
├── app/maker-profile.ts maker name, contact link, and light listings
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
npm run typecheck # check TypeScript types
npm test         # build and run all automated checks
```

## Routes

- `/` — project home
- `/lights` — lights and adult-controlled contact for this site’s maker
- `/studio` — local image-to-STL studio
- `/learn` — setup guidance and an eight-stage learning path with a Codex prompt for every step
- `/prompts` — redirects old links to the first Learn step
- `/gallery` — finished lights
- `/resources` — printer, material, light, and slicer guidance
- `/safety` — child-safety, photograph, contact, hosting, and reporting guidance
- `/code` — source-code map and repository link
- `/about` — mission and project story

## Personalize the maker and lights

Edit [`app/maker-profile.ts`](app/maker-profile.ts) to change:

- the studio and maker names;
- the short maker introduction;
- listing images, titles, and descriptions.

Contact is disabled in repository clones. An adult maker may optionally set
adult-managed contact, and a school, library, or makerspace may optionally set
organization-managed contact, using the `MAKER_CONTACT_HREF` and
`MAKER_CONTACT_LABEL` hosting environment values. Young-maker projects do not
request or publish the young maker’s or parent’s contact information.

Replace the bundled listings before presenting them as current work. Each
deployed website represents its own maker; the Lights page is not a marketplace
or maker directory.

Before publishing, replace or remove every sample listing and have a trusted
adult review all maker information, contact links, photographs, and captions.

## Privacy and safety

- Source photos are processed locally in the browser.
- Giving a photograph to an AI agent is a separate action. Never provide a
  private source photograph to Codex.
- Do not publish names, school details, addresses, or personal photographs
  without permission.
- Before a gallery image is published, an adult removes EXIF/location metadata
  and checks for identifying details and filenames.
- A trusted adult should review publishing and plug-in light choices.
- Always inspect an STL in a slicer before printing.
- Children use printers with adult supervision and avoid hot or moving parts.
- Use only a commercially manufactured, undamaged LED night-light. Never print
  or modify electrical components.

See [Safety & Privacy](https://nodarknights.com/safety) and
[SECURITY.md](SECURITY.md) for reporting and privacy details.

## License and gallery rights

The software and documentation are available under the [MIT License](LICENSE).
Bundled font notices are listed in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Personal and gallery photographs are **not** covered by the MIT License. They
remain copyrighted by their respective owners and are displayed only with
permission. See [public/gallery/README.md](public/gallery/README.md).

Make one. Give one. Teach one.
