# No Dark Nights

An open prompt-to-product project: build a website with Codex, turn an image
into a printable lithophane, publish a private review with Sites, and make a
physical night light.

## What it does

- reads JPG, PNG, WebP, AVIF, GIF, HEIC, and HEIF photos locally in the browser
- provides crop, contrast, curve, thickness, frame, and adapter controls
- previews the model in 3D and as a simulated backlit lithophane
- generates a closed binary STL without uploading the customer photo
- includes standard and compact No Dark Nights size presets
- includes a learning path, reusable Codex prompts, gallery, resources, and
  project architecture guide

The bottom adapter uses a shield-shaped plate with tapered wings and a rounded,
snug-fit slot. The default slot width is 16.5 mm and can be adjusted under the
advanced adapter settings. Confirm the fit in a slicer and with a small test
print before production use.

## Routes

- `/` — project home
- `/studio` — local image-to-STL studio
- `/learn` — seven-stage learning path
- `/prompts` — copyable Codex prompt cards
- `/gallery` — finished lights
- `/resources` — printer, material, light, and slicer guidance
- `/code` — repository map and release status
- `/about` — mission and project story

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Build and validation:

```bash
npm run build
npm run lint
npm test
```
