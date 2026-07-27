import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  COPY_CONFIRMATION_MS,
  copyFeedback,
  copyPromptText,
  copyStateReducer,
} from "../app/copy-prompt-feedback.ts";

test("successful copying shows visible and accessible confirmation", async () => {
  let copiedText = "";
  const result = await copyPromptText("Make a light", {
    async writeText(value) {
      copiedText = value;
    },
  });

  assert.equal(copiedText, "Make a light");
  assert.equal(result, "copied");
  assert.deepEqual(copyFeedback(result), {
    buttonLabel: "Copied!",
    announcement: "Prompt copied to your clipboard.",
  });
});

test("copy confirmation restores the original label", () => {
  assert.ok(
    COPY_CONFIRMATION_MS >= 2000,
    "confirmation should remain visible long enough to notice",
  );
  assert.equal(copyStateReducer("copied", { type: "reset" }), "ready");
  assert.equal(copyFeedback("ready").buttonLabel, "Copy prompt");
});

test("clipboard failure is honest and keeps manual selection available", async () => {
  const result = await copyPromptText("Keep this local", {
    async writeText() {
      throw new Error("Clipboard blocked");
    },
  });

  assert.equal(result, "failed");
  assert.deepEqual(copyFeedback(result), {
    buttonLabel: "Try copy again",
    announcement: "Copy failed — select the prompt and copy it manually",
  });

  const component = await readFile(
    new URL("../app/CopyPrompt.tsx", import.meta.url),
    "utf8",
  );
  assert.match(component, /role="status"/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /aria-atomic="true"/);
  assert.match(component, /className="selectable-prompt"/);
  assert.match(component, /tabIndex=\{0\}/);
  assert.match(component, /COPY_CONFIRMATION_MS/);
  assert.match(component, /dispatch\(\{ type: "reset" \}\)/);
  assert.doesNotMatch(component, /execCommand|setCopyState\\("copied"\\)/);
});
