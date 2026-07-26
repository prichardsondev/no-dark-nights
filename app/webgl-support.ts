type PreviewCanvas = {
  getContext: (kind: string) => unknown;
};

export function detectWebGLSupport(
  createCanvas: () => PreviewCanvas = () =>
    document.createElement("canvas") as PreviewCanvas,
) {
  try {
    const canvas = createCanvas();
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}
