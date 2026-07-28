"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  COPY_CONFIRMATION_MS,
  copyFeedback,
  copyPromptText,
  copyStateReducer,
} from "./copy-prompt-feedback";
import { prependSetupSentence } from "./learner-setup";

export function CopyPrompt({
  title,
  stage,
  purpose,
  prompt,
  disabled = false,
  setupSentence = "",
}: {
  title: string;
  stage: string;
  purpose: string;
  prompt: string;
  disabled?: boolean;
  setupSentence?: string;
}) {
  const [copyState, dispatch] = useReducer(copyStateReducer, "ready");
  const resetTimer = useRef<number | null>(null);
  const feedback = copyFeedback(copyState);
  const promptWithSetup = prependSetupSentence(prompt, setupSentence);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  const copy = async () => {
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }

    const result = await copyPromptText(promptWithSetup, navigator.clipboard);
    dispatch({ type: result });

    if (result === "copied") {
      resetTimer.current = window.setTimeout(() => {
        dispatch({ type: "reset" });
        resetTimer.current = null;
      }, COPY_CONFIRMATION_MS);
    }
  };

  return (
    <article className="prompt-card">
      <div className="prompt-card-heading">
        <div>
          <span>{stage}</span>
          <h3>{title}</h3>
          <p>{purpose}</p>
        </div>
        <button disabled={disabled} type="button" onClick={() => void copy()}>
          {feedback.buttonLabel}
        </button>
      </div>
      <p
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback.announcement}
      </p>
      {copyState === "failed" && (
        <p className="copy-fallback">
          Copy failed — select the prompt and copy it manually
        </p>
      )}
      <pre
        aria-label={`${title} prompt text`}
        className="selectable-prompt"
        tabIndex={0}
      >
        {promptWithSetup}
      </pre>
    </article>
  );
}
