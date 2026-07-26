# No Dark Nights Night-light Studio

A browser-based photo-to-STL tool for the curved lithophane night lights made
by No Dark Nights.

## What it does

- reads JPG, PNG, and WebP photos locally in the browser
- provides crop, contrast, curve, thickness, frame, and adapter controls
- previews the model in 3D and as a simulated backlit lithophane
- generates a closed binary STL without uploading the customer photo
- includes standard and compact No Dark Nights size presets

The default adapter measurements mirror the values used in the existing
Lithophane Maker night-light workflow. Confirm the fit in a slicer and with a
small test print before production use.

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
