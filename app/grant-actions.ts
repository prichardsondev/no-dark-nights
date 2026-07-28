import type { CopyState } from "./copy-prompt-feedback";

export const PROGRAM_SUMMARY =
  "No Dark Nights is a project-based AI, web-development, and additive-manufacturing learning program. In two three-hour instructional sessions, with supervised printing between sessions, learners use Codex to inspect and personalize an open-source website, review changes with Git, generate and calibrate a printable lithophane STL, and manufacture a physical night-light. Learners finish with working software, reviewed source code, a physical artifact, and a portfolio-ready explanation of the complete idea-to-production process. Funding primarily supports reusable computer and 3D-printer stations, managed AI access, instructional delivery, and consumable printing and night-light materials.";

export function grantCopyFeedback(copyState: CopyState) {
  if (copyState === "copied") {
    return {
      buttonLabel: "Copied!",
      announcement: "Program summary copied to your clipboard.",
    };
  }

  if (copyState === "failed") {
    return {
      buttonLabel: "Try copy again",
      announcement:
        "Copy failed — select the program summary and copy it manually",
    };
  }

  return {
    buttonLabel: "Copy Program Summary",
    announcement: "",
  };
}
