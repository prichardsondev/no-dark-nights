import type { Metadata } from "next";
import { CopyPrompt } from "../CopyPrompt";
import { PageIntro, SiteShell } from "../SiteChrome";
import { learningSteps, promptCards } from "../site-data";

export const metadata: Metadata = {
  title: "Learn | No Dark Nights",
  description:
    "Follow seven beginner-friendly lessons with simple instructions, optional Codex prompts, and clear completion checkpoints.",
};

export default function LearnPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="The learning path"
          title="Build the whole project, one step at a time."
          description="Follow the simple instructions yourself, ask Codex for help, or do a little of both. Each step tells you exactly when you are ready to continue."
        />
        <ol className="learn-guide" aria-label="How each lesson works">
          <li>
            <span>1</span>
            <div>
              <strong>Try it yourself</strong>
              <p>Follow a few small, plain-language instructions.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Ask Codex</strong>
              <p>Open the optional prompt whenever you want help.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Check the finish line</strong>
              <p>Do not rush ahead until you can see the result.</p>
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
                <div className="lesson-work">
                  <section>
                    <h3>Try it yourself</h3>
                    <ol>
                      {step.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ol>
                  </section>
                  <aside className="lesson-finish">
                    <span>You’re finished when</span>
                    <strong>{step.deliverable}</strong>
                  </aside>
                </div>
                <details className="lesson-codex">
                  <summary>
                    <span>Optional</span>
                    Ask Codex to help with this step
                  </summary>
                  <CopyPrompt {...prompt} />
                </details>
              </li>
            );
          })}
        </ol>
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
