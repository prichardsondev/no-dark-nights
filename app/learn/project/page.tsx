import type { Metadata } from "next";
import Link from "next/link";
import { CopyPrompt } from "../../CopyPrompt";
import { PageIntro, SiteShell } from "../../SiteChrome";
import { learningSteps, optionalPromptCards, promptCards } from "../../site-data";

export const metadata: Metadata = {
  title: "Build the Project | No Dark Nights",
  description:
    "Follow eight beginner-friendly steps from downloading No Dark Nights to testing and printing a finished light.",
};

export default function ProjectLearningPage() {
  return (
    <SiteShell>
      <main className="learning-project-page site-width">
        <PageIntro
          eyebrow="The complete project"
          title="Eight steps. Open only the one you need."
          description="Read the step, copy the prompt, and check the result. Each step has one finish line and one thing to explain back in your own words."
        />

        <section className="learning-project-notice">
          <span>For young makers and families</span>
          <strong>Keep private photos out of prompts and repositories.</strong>
          <p>
            Use your source photo only inside the Studio. A supervising adult
            handles accounts, permissions, publishing, purchases, and printer
            safety when needed.
          </p>
          <Link href="/safety">Read the full safety guide</Link>
        </section>

        <details className="learning-setup-panel">
          <summary>
            <span>Before Step 1</span>
            <strong>Get ready</strong>
          </summary>
          <div>
            <p>You need a supported Mac or Windows computer and access to Codex through the ChatGPT desktop app.</p>
            <ol>
              <li>Download and install the official ChatGPT desktop app.</li>
              <li>Sign in and open Codex.</li>
              <li>Return here and begin Step 1.</li>
            </ol>
            <a href="https://chatgpt.com/download/" target="_blank" rel="noopener noreferrer">
              Download ChatGPT desktop
            </a>
          </div>
        </details>

        <nav className="learning-step-index" aria-label="Eight project steps">
          {learningSteps.map((step, index) => (
            <a href={`#step-${index + 1}`} key={step.number}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step.title}
            </a>
          ))}
        </nav>

        <section className="learning-step-list" aria-label="Project lessons">
          {learningSteps.map((step, index) => {
            const prompt = promptCards[index];

            return (
              <details id={`step-${index + 1}`} key={step.number} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <small>Step {index + 1} of {learningSteps.length}</small>
                    <h2>{step.title}</h2>
                    <p>{step.summary}</p>
                  </div>
                </summary>
                <div className="learning-step-content">
                  <dl>
                    <div>
                      <dt>What this teaches</dt>
                      <dd>{step.teaches}</dd>
                    </div>
                    <div>
                      <dt>What you need first</dt>
                      <dd>{step.needs}</dd>
                    </div>
                    <div>
                      <dt>Stop or ask permission when</dt>
                      <dd>{step.stopPoints}</dd>
                    </div>
                    <div>
                      <dt>What you should inspect</dt>
                      <dd>{step.inspect}</dd>
                    </div>
                  </dl>
                  {index === 7 && (
                    <Link className="learning-inline-link" href="/studio#base-fit-lab">
                      Open the Base Fit Lab
                    </Link>
                  )}
                  <div className="learning-prompt-panel">
                    <span>Give this prompt to Codex</span>
                    <CopyPrompt {...prompt} />
                  </div>
                  <footer>
                    <p><span>You’re finished when</span><strong>{step.deliverable}</strong></p>
                    <p><span>Reflect</span><strong>{step.reflection}</strong></p>
                  </footer>
                </div>
              </details>
            );
          })}
        </section>

        <details className="learning-after-panel">
          <summary>
            <span>Optional — after step eight</span>
            <strong>Keep improving</strong>
          </summary>
          <p className="learning-after-copy">
            The eight-step path is complete. Use these only for a small,
            privacy-safe follow-up.
          </p>
          <div className="optional-prompt-grid">
            {optionalPromptCards.map((prompt) => (
              <CopyPrompt key={prompt.title} {...prompt} />
            ))}
          </div>
        </details>

        <section className="learning-project-next">
          <div>
            <span>Teaching a group?</span>
            <h2>Use this same eight-step path.</h2>
            <p>The educator guide helps with setup and supervision without changing the learner prompts.</p>
          </div>
          <Link href="/learn/educators">Open the educator guide</Link>
        </section>
      </main>
    </SiteShell>
  );
}
