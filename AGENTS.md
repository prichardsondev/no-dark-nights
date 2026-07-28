# No Dark Nights agent guide

## Purpose

This repository teaches people to move from a prompt to a working website,
printable STL, and finished lithophane night light.

## Beginner-first rules

- Assume a student may be twelve years old and completely new to Git, web
  development, and 3D printing.
- Explain a technical term the first time it appears.
- Prefer a small change the student can inspect and explain.
- When setup needs a sign-in, folder choice, permission, or adult decision,
  stop and ask instead of guessing.
- Keep the path in order: set up the tools, get the project, understand it,
  personalize it, save a reviewed Git/GitHub checkpoint, make a model, test the
  site and STL, publish privately when available, then fit-test and print.

## Product rules

- Keep the interface compact, calm, warm, and task-oriented.
- Do not add a giant hero, jumbotron, carousel, or marketing filler.
- Prefer plain language that a first-time builder can understand.
- Keep source-photo processing on the user’s device.
- Never open, read, attach, upload, or analyze a learner’s private source
  photograph. The learner or supervising adult checks it visually. Inspect the
  STL, settings, tests, and geometry instead; tests use neutral project images.
- Never publish personal gallery photographs without explicit permission.
- Keep maker identity and light listings in `app/maker-profile.ts`. Learner
  clones default to no contact; only an adult site manager may configure contact
  through the hosting environment.
- Treat `/lights` as this site owner’s page, never as a marketplace or maker
  directory. Do not publish a child’s personal contact information.
- Keep the real `nodarknights.com` domain untouched during private review work.
- Use “Make one. Give one. Teach one.” as the shared mission phrase.

## Geometry rules

- Preserve build-plate orientation, outward face winding, and closed manifold
  geometry.
- Preserve the default 16.5 mm slot unless a user deliberately changes it.
- Keep preview and STL image orientation identical.
- Test portrait, landscape, transparent, and extreme-aspect-ratio images.

## Verification

Run:

```bash
npm run lint
npm test
```

For deployable changes, build successfully, review the important browser routes,
and publish a private Sites version before discussing a real-domain change.

## Release rules

- Keep `.openai/hosting.json` and its `project_id` unchanged.
- Do not commit `.env` files, credentials, build output, local downloads, or
  unapproved photographs.
- Gallery photographs have separate rights and are not covered by the MIT
  software license.
- Preserve the public repository URL:
  `https://github.com/prichardsondev/no-dark-nights`.
- Do not connect or redirect `nodarknights.com` without explicit approval.
