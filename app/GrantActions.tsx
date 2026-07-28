"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  COPY_CONFIRMATION_MS,
  copyPromptText,
  copyStateReducer,
} from "./copy-prompt-feedback";
import { grantCopyFeedback, PROGRAM_SUMMARY } from "./grant-actions";

export function GrantActions() {
  const [copyState, dispatch] = useReducer(copyStateReducer, "ready");
  const resetTimer = useRef<number | null>(null);
  const feedback = grantCopyFeedback(copyState);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  const copySummary = async () => {
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }

    const result = await copyPromptText(PROGRAM_SUMMARY, navigator.clipboard);
    dispatch({ type: result });

    if (result === "copied") {
      resetTimer.current = window.setTimeout(() => {
        dispatch({ type: "reset" });
        resetTimer.current = null;
      }, COPY_CONFIRMATION_MS);
    }
  };

  return (
    <section
      className="grant-tools"
      aria-labelledby="grant-writing-tools-title"
    >
      <div className="grant-tools-heading">
        <span className="site-eyebrow">Grant-writing tools</span>
        <h2 id="grant-writing-tools-title">Reuse the brief.</h2>
        <p>
          Copy the summary into an application, or use your browser to print
          this page or save it as a PDF. These controls do not collect or
          transmit information.
        </p>
      </div>
      <div className="grant-summary-card">
        <h3>Program summary</h3>
        <p className="selectable-summary" tabIndex={0}>
          {PROGRAM_SUMMARY}
        </p>
        <div className="grant-tool-actions">
          <button type="button" onClick={() => void copySummary()}>
            {feedback.buttonLabel}
          </button>
          <button type="button" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
        </div>
        <p
          className="grant-copy-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {feedback.announcement}
        </p>
        {copyState === "failed" && (
          <p className="grant-copy-fallback">
            Copy failed — select the program summary and copy it manually
          </p>
        )}
      </div>
    </section>
  );
}
