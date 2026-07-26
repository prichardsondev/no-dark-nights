"use client";

import { useState } from "react";

export function CopyPrompt({
  title,
  stage,
  purpose,
  prompt,
}: {
  title: string;
  stage: string;
  purpose: string;
  prompt: string;
}) {
  const [copyState, setCopyState] = useState<"ready" | "copied" | "failed">(
    "ready",
  );

  const copy = async () => {
    setCopyState("copied");

    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = prompt;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand("copy");
      textArea.remove();

      if (!copied) {
        setCopyState("failed");
        window.setTimeout(() => setCopyState("ready"), 2400);
        return;
      }
    }

    window.setTimeout(() => setCopyState("ready"), 1800);
  };

  return (
    <article className="prompt-card">
      <div className="prompt-card-heading">
        <div>
          <span>{stage}</span>
          <h2>{title}</h2>
          <p>{purpose}</p>
        </div>
        <button type="button" onClick={() => void copy()}>
          {copyState === "copied"
            ? "Copied"
            : copyState === "failed"
              ? "Select prompt below"
              : "Copy prompt"}
        </button>
      </div>
      <pre>{prompt}</pre>
    </article>
  );
}
