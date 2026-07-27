import type { Metadata } from "next";
import { CopyPrompt } from "../CopyPrompt";
import { PageIntro, SiteShell } from "../SiteChrome";
import {
  learningSteps,
  optionalPromptCards,
  promptCards,
} from "../site-data";

export const metadata: Metadata = {
  title: "Learn | No Dark Nights",
  description:
    "Follow seven beginner-friendly lessons by reading each step, giving its prompt to Codex, and checking the result.",
};

export default function LearnPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="The learning path"
          title="Build the whole project, one step at a time."
          description="Read what each step will do, copy its prompt into Codex, and check the result before moving on."
        />
        <ol className="learn-guide" aria-label="How each lesson works">
          <li>
            <span>1</span>
            <div>
              <strong>Read the step</strong>
              <p>Know what you are making and why it matters.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Copy the prompt</strong>
              <p>Give Codex the complete prompt and let it work with you.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Check the result</strong>
              <p>Continue only when the finish line for that step is true.</p>
            </div>
          </li>
        </ol>
        <section className="learn-start">
          <div>
            <h2>Before you begin</h2>
            <ul>
              <li>A computer that can run Codex</li>
              <li>A trusted adult or teacher for publishing</li>
              <li>Access to a 3D printer for the final stages</li>
              <li>A photo you have permission to use</li>
            </ul>
          </div>
          <div>
            <h2>Four useful words</h2>
            <dl className="tiny-glossary">
              <div><dt>Repository</dt><dd>The project folder and its history.</dd></div>
              <div><dt>Clone</dt><dd>Download your own working copy.</dd></div>
              <div><dt>Local</dt><dd>Running only on your computer.</dd></div>
              <div><dt>STL</dt><dd>A file that describes a printable 3D shape.</dd></div>
            </dl>
          </div>
        </section>
        <ol className="lesson-list">
          {learningSteps.map((step, index) => {
            const prompt = promptCards[index];

            return (
              <li id={`step-${index + 1}`} key={step.number}>
                <header className="lesson-heading">
                  <span>{step.number}</span>
                  <div>
                    <small>Step {index + 1} of {learningSteps.length}</small>
                    <h2>{step.title}</h2>
                    <p>{step.summary}</p>
                  </div>
                </header>
                <div className="lesson-prompt">
                  <span>Give this prompt to Codex</span>
                  <CopyPrompt {...prompt} />
                </div>
                <aside className="lesson-finish">
                  <span>You’re finished when</span>
                  <strong>{step.deliverable}</strong>
                </aside>
              </li>
            );
          })}
        </ol>
        <section className="optional-lessons" aria-labelledby="keep-improving">
          <div className="optional-lessons-heading">
            <span className="site-eyebrow">Optional — after step seven</span>
            <h2 id="keep-improving">Keep improving</h2>
            <p>
              The numbered path is complete. Use these prompts only when you
              want to share a privacy-safe project story or practice one small
              improvement.
            </p>
          </div>
          <div className="optional-prompt-grid">
            {optionalPromptCards.map((prompt) => (
              <CopyPrompt key={prompt.title} {...prompt} />
            ))}
          </div>
        </section>
        <section className="next-step">
          <div>
            <span className="site-eyebrow">One step at a time</span>
            <h2>You are allowed to stop and ask questions.</h2>
            <p>
              If Codex moves too quickly, say: “Stop and explain that in simpler
              words.” Learning what changed is part of making the project.
            </p>
          </div>
          <a href="#step-1">Start with step one ↑</a>
        </section>
      </main>
    </SiteShell>
  );
}
