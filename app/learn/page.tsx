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
            <h2 id="setup-title">Get ready</h2>
          </div>
          <div className="setup-ready-grid">
            <div>
              <h3>You&apos;ll need</h3>
              <ul>
                <li>A supported Mac or Windows computer</li>
                <li>Access to Codex through the ChatGPT desktop app</li>
                <li>An adult&apos;s help if you are under 13</li>
              </ul>
            </div>
            <div>
              <h3>Getting started</h3>
              <ol>
                <li>Download and install the official ChatGPT desktop app.</li>
                <li>Sign in and open Codex.</li>
                <li>Return here and begin Step 1.</li>
              </ol>
              <a
                className="setup-primary-action"
                href="https://chatgpt.com/download/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download ChatGPT desktop ↗
              </a>
            </div>
          </div>
          <p className="setup-sequence" aria-label="Install ChatGPT, then open Codex, then start Step 1">
            Install ChatGPT <span aria-hidden="true">→</span> Open Codex{" "}
            <span aria-hidden="true">→</span> Start Step 1
          </p>
          <a className="educator-setup-link" href="#school-lab-setup">
            Educator or school lab? View managed setup options.
          </a>
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
        <section
          id="school-lab-setup"
          className="school-lab-section"
          aria-labelledby="school-lab-title"
        >
          <div className="school-lab-heading">
            <span className="site-eyebrow">Managed setup options</span>
            <h2 id="school-lab-title">For educators running a school lab</h2>
            <p>
              A teacher or administrator can prepare a managed local Codex
              environment for learners who cannot use the standard ChatGPT
              sign-in path.
            </p>
          </div>
          <div className="school-lab-grid">
            <article>
              <h3>Prepare managed access</h3>
              <ul>
                <li>
                  Amazon Bedrock can provide supported OpenAI models through
                  school-managed AWS sign-in and spending controls.
                </li>
                <li>
                  An instructor or administrator should prepare and test the
                  environment before learners begin.
                </li>
                <li>
                  Provide limited, revocable student access—never root
                  credentials or permanent shared keys.
                </li>
              </ul>
              <a
                href="https://learn.chatgpt.com/docs/amazon-bedrock"
                target="_blank"
                rel="noopener noreferrer"
              >
                Official Amazon Bedrock setup guidance ↗
              </a>
            </article>
            <article>
              <h3>Protect credentials</h3>
              <ul>
                <li>
                  Students must never paste AWS credentials into prompts, source
                  files, committed <code>.env</code> files, screenshots, or
                  GitHub.
                </li>
                <li>
                  Keep credentials out of project folders and revoke access when
                  a class or lab session ends.
                </li>
                <li>
                  Follow school privacy, account, permission, and spending
                  policies.
                </li>
              </ul>
            </article>
            <article>
              <h3>What students can complete</h3>
              <ul>
                <li>
                  Bedrock-backed Codex supports the local website, Git, an
                  approved GitHub repository, Studio, testing, and printing.
                </li>
                <li>
                  A local project and approved GitHub repository are valid
                  completion points.
                </li>
                <li>
                  The Studio can make an STL without Codex. See the{" "}
                  <Link href="/resources">parts and tools we use</Link>.
                </li>
              </ul>
            </article>
            <article>
              <h3>Plan publishing separately</h3>
              <ul>
                <li>
                  OpenAI-hosted services such as Sites are not available through
                  Bedrock-only authentication.
                </li>
                <li>Publishing is optional for this learning path.</li>
                <li>
                  An instructor with eligible ChatGPT and Sites access may
                  review and publish an approved preview separately.
                </li>
              </ul>
            </article>
          </div>
          <div className="school-lab-note">
            <h3>Age, consent, and adult responsibilities</h3>
            <p>
              ChatGPT is not intended for children under 13. Young people ages
              13–17 need permission from a parent or guardian. In an educational
              activity for a child under 13, the adult must conduct the direct
              interaction with ChatGPT. Adults should also manage installation,
              permissions, publishing, purchases, printer supervision, and
              light safety when appropriate.
            </p>
            <a
              href="https://help.openai.com/en/articles/8313401-is-chatgpt-safe-for-all-ages"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read OpenAI&apos;s age guidance ↗
            </a>
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
              <p>
                Learners finish with a working website they can continue using
                as a maker portfolio, community-giving project, or foundation
                for a small creative enterprise.
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
