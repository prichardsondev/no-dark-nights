import type { Metadata } from "next";
import Link from "next/link";
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
    "Set up Codex, then follow eight beginner-friendly steps from downloading the project to printing and reflecting.",
};

export default function LearnPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="The learning path"
          title="Build the whole project, one step at a time."
          description="Set up your tools first. Then read, copy, inspect, and reflect through eight clear steps."
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
        <section className="setup-section" aria-labelledby="setup-title">
          <div className="setup-heading">
            <span className="site-eyebrow">Before Step 1</span>
            <h2 id="setup-title">Set Up Your Tools</h2>
            <p>
              Codex is OpenAI&apos;s coding agent: you describe a goal, and it
              can read, explain, and change a project with you. Beginners should
              start with the official ChatGPT desktop app for macOS or Windows.
            </p>
            <div className="setup-links">
              <a
                href="https://chatgpt.com/download/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download the official ChatGPT app ↗
              </a>
              <a
                href="https://help.openai.com/en/articles/20001276/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenAI desktop setup help ↗
              </a>
            </div>
          </div>
          <div className="setup-grid">
            <article>
              <span>01</span>
              <h3>Install and sign in</h3>
              <p>
                Open the app, select <strong>Continue to sign in</strong>,
                finish the browser sign-in, then choose <strong>Codex</strong>{" "}
                from the top-left menu. Confirm you can start a local Codex
                task.
              </p>
              <p>
                Codex availability and usage can depend on your account, plan,
                workspace, and administrator. This project does not promise
                free access.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Choose a project folder</h3>
              <p>
                Make one easy-to-find folder for your projects. Codex will ask
                before it opens folders or uses permissions. Read each request;
                do not approve something you do not understand.
              </p>
              <p>
                The Codex command-line tool or editor extension are optional
                advanced choices. You do not need them for this path.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Know when an adult helps</h3>
              <p>
                An adult should handle accounts, installation, permissions,
                publishing, purchases, and printer or electrical decisions
                when appropriate.
              </p>
              <p>
                Follow your school&apos;s or family&apos;s rules even when they
                are stricter than this guide.
              </p>
            </article>
          </div>
          <div className="age-guidance">
            <h3>Official age guidance</h3>
            <p>
              ChatGPT is not intended for children under 13. Young people ages
              13–17 need permission from a parent or guardian. In an educational
              activity for a child under 13, the adult must conduct the direct
              interaction with ChatGPT.
            </p>
            <a
              href="https://help.openai.com/en/articles/8313401-is-chatgpt-safe-for-all-ages"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read OpenAI&apos;s age guidance ↗
            </a>
          </div>
          <div className="readiness-card">
            <div>
              <h3>Ready for Step 1?</h3>
              <p>Check these with an adult or teacher when appropriate.</p>
            </div>
            <ul>
              <li>A supported Mac or Windows computer</li>
              <li>An eligible OpenAI account and working Codex access</li>
              <li>A trusted adult for account or publishing decisions</li>
              <li>An easy-to-find project folder</li>
              <li>A GitHub account for Step 4</li>
              <li>Sites access, or permission to stop at local + GitHub</li>
              <li>A photograph you have permission to use</li>
              <li>A compatible printer and slicer for the physical stages</li>
            </ul>
            <p className="setup-trouble">
              If Codex is missing, sign out and back in, update the desktop app,
              check your plan or workspace access, and ask a parent, teacher, or
              workspace administrator. You can still use the Studio to make an
              STL without Codex. See the{" "}
              <Link href="/resources">parts and tools we use</Link>.
            </p>
          </div>
        </section>
        <section className="learn-start">
          <div>
            <h2>Four useful words</h2>
            <dl className="tiny-glossary">
              <div><dt>Repository</dt><dd>The project folder and its history.</dd></div>
              <div><dt>Clone</dt><dd>Download your own working copy.</dd></div>
              <div><dt>Local</dt><dd>Running only on your computer.</dd></div>
              <div><dt>STL</dt><dd>A file that describes a printable 3D shape.</dd></div>
            </dl>
          </div>
          <div>
            <h2>One path, eight checkpoints</h2>
            <p>
              Do not skip a finish line. Each step tells you what to learn,
              what you need, when to stop, what to inspect, and what to explain
              in your own words.
            </p>
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
                <dl className="lesson-checkpoints">
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
                <div className="lesson-prompt">
                  <span>Give this prompt to Codex</span>
                  <CopyPrompt {...prompt} />
                </div>
                <aside className="lesson-finish">
                  <div>
                    <span>You’re finished when</span>
                    <strong>{step.deliverable}</strong>
                  </div>
                  <div>
                    <span>Reflect</span>
                    <strong>{step.reflection}</strong>
                  </div>
                </aside>
              </li>
            );
          })}
        </ol>
        <section className="optional-lessons" aria-labelledby="keep-improving">
          <div className="optional-lessons-heading">
            <span className="site-eyebrow">Optional — after step eight</span>
            <h2 id="keep-improving">Keep improving</h2>
            <p>
              The eight-step path is complete. Use these prompts only when you
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
        <section className="educator-section" aria-labelledby="educators-title">
          <div>
            <span className="site-eyebrow">For educators</span>
            <h2 id="educators-title">A real artifact at every stage.</h2>
            <p>
              Learners can participate through discussion and local testing,
              even when they do not have every account or piece of equipment.
            </p>
          </div>
          <div className="educator-grid">
            <article>
              <h3>What learners practice</h3>
              <p>
                AI-agent literacy, web development, Git and GitHub, image and
                3D-model processing, design iteration, privacy, consent,
                communication, and responsible publishing.
              </p>
            </article>
            <article>
              <h3>Accounts and equipment</h3>
              <p>
                The full path uses Codex, GitHub, Sites, a permitted image, a
                slicer, a compatible printer, material, and a measured
                night-light housing. Local-only alternatives are valid.
              </p>
            </article>
            <article>
              <h3>Adult responsibilities</h3>
              <p>
                Adults manage age and consent requirements, accounts,
                installation, permissions, contact details, publishing,
                purchases, printer supervision, and light safety as needed.
              </p>
            </article>
            <article>
              <h3>Evidence of learning</h3>
              <p>
                A project map, personalized local site, reviewed Git commit,
                STL and settings note, test report, optional private preview,
                fit test, finished light, and short reflection.
              </p>
            </article>
          </div>
          <p className="educator-note">
            Do not require a public website, personal photograph, purchase, or
            physical print to complete the learning activity. Follow school and
            family policies, and use OpenAI&apos;s age guidance above.
          </p>
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
