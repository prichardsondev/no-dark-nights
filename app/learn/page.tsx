import Link from "next/link";
import { PageIntro, SiteShell } from "../SiteChrome";
import { learningSteps } from "../site-data";

export default function LearnPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="The learning path"
          title="Build the whole project, one step at a time."
          description="Seven stages, in order. You do not need to know coding or 3D-printing words before you begin."
        />
        <div className="lesson-layout">
          <aside className="lesson-aside">
            <strong>Before you begin</strong>
            <ul>
              <li>A computer that can run Codex</li>
              <li>A trusted adult or teacher for publishing</li>
              <li>Access to a 3D printer for the final stages</li>
              <li>A photo you have permission to use</li>
            </ul>
            <dl className="tiny-glossary">
              <div><dt>Repository</dt><dd>The project folder and its history.</dd></div>
              <div><dt>Clone</dt><dd>Download your own working copy.</dd></div>
              <div><dt>Local</dt><dd>Running only on your computer.</dd></div>
              <div><dt>STL</dt><dd>A file that describes a printable 3D shape.</dd></div>
            </dl>
            <Link href="/prompts">Copy prompt number one →</Link>
          </aside>
          <ol className="lesson-list">
            {learningSteps.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.summary}</p>
                  <small>
                    <strong>Finish with:</strong> {step.deliverable}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <section className="next-step">
          <div>
            <span className="site-eyebrow">Keep going</span>
            <h2>Your first prompt does not need to be perfect.</h2>
            <p>
              Start with the result you want. Review what Codex makes, then use
              follow-up messages to improve one clear thing at a time.
            </p>
          </div>
          <Link href="/prompts">Use a starter prompt →</Link>
        </section>
      </main>
    </SiteShell>
  );
}
