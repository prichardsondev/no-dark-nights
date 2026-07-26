# No Dark Nights agent guide

## Purpose

This repository teaches people to move from a prompt to a working website,
printable STL, and finished lithophane night light.

## Product rules

- Keep the interface compact, calm, warm, and task-oriented.
- Do not add a giant hero, jumbotron, carousel, or marketing filler.
- Prefer plain language that a first-time builder can understand.
- Keep source-photo processing on the user’s device.
- Never publish personal gallery photographs without explicit permission.
- Keep the real `nodarknights.com` domain untouched during private review work.

## Geometry rules

- Preserve build-plate orientation, outward face winding, and closed manifold
  geometry.
- Preserve the default 16.5 mm slot unless a user deliberately changes it.
- Keep preview and STL image orientation identical.
- Test portrait, landscape, transparent, and extreme-aspect-ratio images.

## Verification

Run:

```bash
npm test
```

For deployable changes, build successfully, review the important browser routes,
and publish a private Sites version before discussing a real-domain change.

