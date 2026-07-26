import Link from "next/link";
import { PageIntro, SiteShell } from "../SiteChrome";

export default function CodePage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Open project"
          title="The complete project will live here."
          description="The website, lithophane engine, prompts, and tests are being prepared as one classroom-friendly repository."
        />
        <div className="code-layout">
          <section className="repo-map">
            <h2>Project map</h2>
            <pre>{`no-dark-nights/
├── app/                 website and studio
├── app/lithophane…      image-to-STL engine
├── tests/               geometry and page checks
├── lessons/             student learning path
├── prompts/             reusable Codex prompts
├── examples/            sample images and STLs
├── AGENTS.md            durable project guidance
└── README.md            start here`}</pre>
          </section>
          <aside className="repo-status">
            <span className="status-dot" />
            <strong>Public repository preparation</strong>
            <p>
              The working code is complete. The classroom-friendly starter,
              license, example files, and contribution guide are the next
              release step.
            </p>
            <p>
              Until the public repository is connected, use the lessons and
              prompt cards to explore how the finished project is organized.
            </p>
          </aside>
        </div>
        <section className="principle-grid">
          <article>
            <span>01</span>
            <h2>Readable first</h2>
            <p>Students should be able to ask what a file does and verify the answer.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Tests protect the hard parts</h2>
            <p>Geometry orientation, manifold edges, and unusual image shapes stay checked.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Private by default</h2>
            <p>Photos are processed locally and publishing starts with a private review.</p>
          </article>
        </section>
        <section className="next-step">
          <div>
            <span className="site-eyebrow">First prompt ready</span>
            <h2>When the GitHub link is connected, Codex can handle the setup.</h2>
            <p>
              The first prompt explains how to download the project, open the
              right folder, install it, and start the local website.
            </p>
          </div>
          <Link href="/prompts">Copy the setup prompt</Link>
        </section>
      </main>
    </SiteShell>
  );
}
