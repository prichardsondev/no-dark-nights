import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, SiteShell } from "../../SiteChrome";

export const metadata: Metadata = {
  title: "Educator Guide | No Dark Nights",
  description:
    "Prepare accounts, permissions, equipment, and supervision for the shared No Dark Nights learning path.",
};

export default function EducatorGuidePage() {
  return (
    <SiteShell>
      <main className="educator-guide-page site-width">
        <PageIntro
          eyebrow="For educators running a school lab"
          title="Prepare the room. Keep one shared learning path."
          description="This guide covers setup and supervision. Learners still use the same eight project steps."
        />

        <section className="educator-path-card">
          <div>
            <span>The curriculum</span>
            <h2>One path, eight checkpoints.</h2>
            <p>
              Learners move from a local website to a reviewed Git checkpoint,
              printable STL, tests, optional private preview, fit test, finished
              light, and short reflection.
            </p>
          </div>
          <Link href="/learn/project">Open the eight-step project</Link>
        </section>

        <section className="educator-guide-grid" aria-label="Educator preparation">
          <article>
            <span>01</span>
            <h2>Before learners arrive</h2>
            <ul>
              <li>Test the local project and Studio on the computers being used.</li>
              <li>Confirm account, installation, GitHub, and publishing policies.</li>
              <li>Prepare a neutral test image; private photos stay with families.</li>
            </ul>
          </article>
          <article>
            <span>02</span>
            <h2>Adult responsibilities</h2>
            <ul>
              <li>Adults manage accounts, permissions, public contact, and publishing.</li>
              <li>Adults handle purchases and supervise printers and electrical safety.</li>
              <li>Do not require a public website, purchase, or physical print to finish.</li>
            </ul>
          </article>
          <article>
            <span>03</span>
            <h2>Evidence of learning</h2>
            <ul>
              <li>A project map and personalized local site.</li>
              <li>A reviewed Git commit, STL, settings note, and test report.</li>
              <li>A fit test or written plan, plus a short reflection.</li>
              <li>A working website they can continue using as a maker portfolio, community-giving project, or foundation for a small creative enterprise.</li>
            </ul>
          </article>
        </section>

        <details className="educator-managed-setup">
          <summary>
            <span>School or managed lab</span>
            <strong>Using Amazon Bedrock-backed Codex</strong>
          </summary>
          <div>
            <p>
              Amazon Bedrock can provide supported OpenAI models through
              school-managed AWS sign-in and spending controls. Students
              receive limited, revocable student access—never root credentials
              or permanent shared keys.
            </p>
            <ul>
              <li>Students must never paste AWS credentials into prompts, files, screenshots, or GitHub.</li>
              <li>Bedrock-backed Codex supports local work, Git, approved GitHub repositories, testing, and printing.</li>
              <li>A local project and approved GitHub repository are valid completion points.</li>
              <li>OpenAI-hosted Sites are not available through Bedrock-only authentication; publishing remains optional.</li>
            </ul>
            <a href="https://learn.chatgpt.com/docs/amazon-bedrock" target="_blank" rel="noopener noreferrer">
              Official Amazon Bedrock setup guidance
            </a>
          </div>
        </details>

        <section className="educator-age-note">
          <h2>Age, consent, and privacy</h2>
          <p>
            ChatGPT is not intended for children under 13. OpenAI requires an
            adult to conduct ChatGPT/Codex interactions for children under 13
            and parent or guardian permission for ages 13–17. Young people ages
            13–17 need permission from a parent or guardian.
            Families and educators decide how they want to guide the rest of
            the project. The site never needs a child&apos;s personal contact
            information. In an educational activity for a child under 13, the
            adult must conduct the direct interaction with ChatGPT.
          </p>
          <a href="https://help.openai.com/en/articles/8313401-is-chatgpt-safe-for-all-ages" target="_blank" rel="noopener noreferrer">
            Read OpenAI&apos;s age guidance
          </a>
        </section>

        <section className="educator-final-links">
          <Link href="/resources">Parts and print guidance</Link>
          <Link href="/safety">Safety and privacy</Link>
          <Link href="/grants">Use the Grant Kit</Link>
        </section>
      </main>
    </SiteShell>
  );
}
