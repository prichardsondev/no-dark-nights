import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, SiteShell } from "../SiteChrome";
import { REPOSITORY_URL } from "../site-data";

export const metadata: Metadata = {
  title: "Code | No Dark Nights",
  description:
    "Download the complete No Dark Nights lithophane maker, lessons, prompts, and tests from GitHub.",
};

export default function CodePage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Open project"
          title="Download, inspect, and change the complete project."
          description="The website, lithophane engine, prompts, lessons, and tests are public and free to learn from."
        />
        <div className="repo-action">
          <a href={REPOSITORY_URL} rel="noreferrer" target="_blank">
            Open the project on GitHub
          </a>
          <code>github.com/prichardsondev/no-dark-nights</code>
        </div>
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
            <strong>Public and ready to clone</strong>
            <p>
              The source includes beginner setup instructions, an MIT license,
              contribution and privacy guidance, and automated checks.
            </p>
            <p>
              Gallery photographs have separate rights and are not included in
              the software license.
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
            <h2>Codex can download and start the project for you.</h2>
            <p>
              The repository link is already included. Copy the setup prompt,
              paste it into Codex, and follow along.
            </p>
          </div>
          <Link href="/prompts">Copy the setup prompt</Link>
        </section>
      </main>
    </SiteShell>
  );
}
