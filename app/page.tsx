import Link from "next/link";
import { SiteShell } from "./SiteChrome";
import { galleryItems } from "./site-data";

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="home-opening site-width">
          <div className="opening-copy">
            <span className="site-eyebrow">Prompt to product</span>
            <h1>Make something that brings a little light.</h1>
            <p>
              Turn a favorite image into a real night light, learn how the
              website works, and build your own version with Codex.
            </p>
          </div>
          <div className="opening-actions" aria-label="Start here">
            <Link className="start-card primary" href="/studio">
              <span>01</span>
              <strong>Make a light</strong>
              <p>Upload a photo, preview the real model, and download an STL.</p>
              <i>Open the studio →</i>
            </Link>
            <Link className="start-card" href="/learn">
              <span>02</span>
              <strong>Learn the project</strong>
              <p>Follow the path from your first prompt to a finished print.</p>
              <i>See the lessons →</i>
            </Link>
            <Link className="start-card" href="/code">
              <span>03</span>
              <strong>Build your own</strong>
              <p>Explore the code, prompts, tests, and project structure.</p>
              <i>Explore the code →</i>
            </Link>
          </div>
        </section>

        <section className="compact-story site-width">
          <div>
            <span className="site-eyebrow">Why it exists</span>
            <h2>A small object can carry a big memory.</h2>
          </div>
          <div>
            <p>
              No Dark Nights started with custom 3D-printed lights made for
              smiles, not margins. Now the whole process is open: the maker,
              the code, the prompts, and the lessons.
            </p>
            <Link className="text-link" href="/about">
              Read our story →
            </Link>
          </div>
        </section>

        <section className="gallery-preview">
          <div className="section-bar site-width">
            <div>
              <span className="site-eyebrow">Made to be given</span>
              <h2>Real lights, real stories.</h2>
            </div>
            <Link href="/gallery">View the gallery →</Link>
          </div>
          <div className="home-gallery site-width">
            {galleryItems.slice(0, 4).map((item) => (
              <figure key={item.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="how-it-works site-width">
          <div className="section-bar">
            <div>
              <span className="site-eyebrow">One complete project</span>
              <h2>Idea → code → model → light</h2>
            </div>
          </div>
          <ol className="process-grid">
            <li>
              <span>01</span>
              <strong>Describe</strong>
              <p>Tell Codex what you want to make and what must stay true.</p>
            </li>
            <li>
              <span>02</span>
              <strong>Inspect</strong>
              <p>Review the page, the model, the changes, and the test results.</p>
            </li>
            <li>
              <span>03</span>
              <strong>Print</strong>
              <p>Measure the light, slice the STL, and start with a fit test.</p>
            </li>
            <li>
              <span>04</span>
              <strong>Share</strong>
              <p>Gift the light, tell its story, or help someone build another.</p>
            </li>
          </ol>
        </section>

        <section className="home-invitation">
          <div className="site-width">
            <p>Ready to make the first one?</p>
            <Link href="/studio">Open the night-light studio →</Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
