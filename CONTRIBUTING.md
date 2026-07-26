# Contributing to No Dark Nights

Thank you for helping people learn by making something real.

## Good first contributions

- clarify a confusing instruction;
- improve keyboard or mobile behavior;
- add a test for an unusual but non-personal image shape;
- improve printing guidance with evidence;
- fix a small accessibility issue.

Please keep changes focused. A student should be able to understand what
changed and why.

## Before you begin

1. Read `README.md` and `AGENTS.md`.
2. Create a branch for one clear change.
3. Do not add personal photographs, names, school information, credentials,
   generated build output, or downloaded STL files.
4. Use only example assets that you created or have permission to release.

## Verify your change

```bash
npm install
npm run lint
npm test
```

For interface changes, inspect the affected page on desktop and mobile. For
geometry changes, test portrait, landscape, transparent, and extreme image
shapes and inspect the STL in a slicer.

## Pull requests

Explain:

- what changed;
- why it helps;
- how you tested it;
- whether it changes privacy, image handling, STL geometry, or print fit.

Do not include personal source images in screenshots or test fixtures.

## Community expectations

Be patient, specific, and kind. Explain unfamiliar terms. Correct the work,
not the person. Young builders and first-time contributors are welcome here.
