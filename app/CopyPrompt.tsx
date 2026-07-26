"use client";

import { useState } from "react";

export function CopyPrompt({
  title,
  stage,
  prompt,
}: {
  title: string;
  stage: string;
  prompt: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className="prompt-card">
      <div className="prompt-card-heading">
        <div>
          <span>{stage}</span>
          <h2>{title}</h2>
        </div>
        <button type="button" onClick={() => void copy()}>
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
      <pre>{prompt}</pre>
    </article>
  );
}

