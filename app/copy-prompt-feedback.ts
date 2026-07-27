export type CopyState = "ready" | "copied" | "failed";

export type CopyAction =
  | { type: "copied" }
  | { type: "failed" }
  | { type: "reset" };

export const COPY_CONFIRMATION_MS = 2400;

export function copyStateReducer(
  _state: CopyState,
  action: CopyAction,
): CopyState {
  if (action.type === "copied") return "copied";
  if (action.type === "failed") return "failed";
  return "ready";
}

export function copyFeedback(copyState: CopyState) {
  if (copyState === "copied") {
    return {
      buttonLabel: "Copied!",
      announcement: "Prompt copied to your clipboard.",
    };
  }

  if (copyState === "failed") {
    return {
      buttonLabel: "Try copy again",
      announcement: "Copy failed — select the prompt and copy it manually",
    };
  }

  return {
    buttonLabel: "Copy prompt",
    announcement: "",
  };
}

export async function copyPromptText(
  prompt: string,
  clipboard: Pick<Clipboard, "writeText"> | null | undefined,
): Promise<Exclude<CopyState, "ready">> {
  if (!clipboard?.writeText) return "failed";

  try {
    await clipboard.writeText(prompt);
    return "copied";
  } catch {
    return "failed";
  }
}
