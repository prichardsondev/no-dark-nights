export const learnerSetups = [
  {
    id: "adult",
    label: "Adult maker",
    promptSentence:
      "I am an adult managing my own accounts, contact information, publishing, purchases, and equipment.",
  },
  {
    id: "young",
    label: "Young maker with an adult",
    promptSentence:
      "This is a young-maker project supervised by an adult. If the maker is under 13, the supervising adult is conducting every Codex interaction and managing GitHub, publishing, contact, purchases, and equipment. Ages 13–17 participate with parent or guardian permission.",
  },
  {
    id: "organization",
    label: "School, library, or makerspace",
    promptSentence:
      "This is an organization-managed learning project. Use only approved accounts, repositories, contact information, images, equipment, and publishing methods. Do not request or publish student identifying information.",
  },
] as const;

export type LearnerSetupId = (typeof learnerSetups)[number]["id"];

export function getSetupPromptSentence(setupId: LearnerSetupId | null) {
  return (
    learnerSetups.find((setup) => setup.id === setupId)?.promptSentence ?? ""
  );
}

export function buildSetupPrompt(
  prompt: string,
  setupId: LearnerSetupId | null,
) {
  return prependSetupSentence(prompt, getSetupPromptSentence(setupId));
}

export function prependSetupSentence(prompt: string, setupSentence: string) {
  return setupSentence ? `${setupSentence}\n\n${prompt}` : prompt;
}
