import Link from "next/link";
import { SiteShell } from "./SiteChrome";
import { galleryItems } from "./site-data";

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="home-opening site-width">
          <div className="opening-copy">
            <span className="site-eyebrow">Photo → code → print → light</span>
            <h1>Build a night light from a photo.</h1>
            <p>
              Use the maker now, or follow the project from its first Codex
              prompt to a light you can plug in.
            </p>
          </div>
          <div className="opening-actions" aria-label="Start here">
            <Link className="start-card primary" href="/studio">
              <strong>Make a light</strong>
              <p>Upload a photo, preview the real model, and download an STL.</p>
              <i>Open studio</i>
            </Link>
            <Link className="start-card" href="/prompts">
              <strong>Build the whole project</strong>
              <p>Start with the prompt that downloads and opens the code.</p>
              <i>Copy prompt 1</i>
            </Link>
            <Link className="start-card" href="/learn">
              <strong>See every step</strong>
              <p>Learn the site, model, tests, publishing, and printing.</p>
              <i>Open guide</i>
            </Link>
          </div>
        </section>

        <section className="compact-story site-width">
          <div>
            <span className="site-eyebrow">The point</span>
            <h2>Make one. Give one. Teach one.</h2>
          </div>
          <div>
            <p>
              We make custom lights and give many of them away. This project
              gives away the process too: the maker, code, prompts, tests, and
              lessons.
            </p>
            <Link className="text-link" href="/about">
              Why we built it
            </Link>
          </div>
        </section>

        <section className="gallery-preview">
          <div className="section-bar site-width">
            <div>
              <span className="site-eyebrow">Finished lights</span>
              <h2>Made by people, for people.</h2>
            </div>
            <Link href="/gallery">See all eight</Link>
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
              <span className="site-eyebrow">How the project moves</span>
              <h2>Ask. Check. Print. Share.</h2>
            </div>
          </div>
          <ol className="process-grid">
            <li>
              <span>ASK</span>
              <strong>Describe</strong>
              <p>Tell Codex what you want to make and what must stay true.</p>
            </li>
            <li>
              <span>CHECK</span>
              <strong>Inspect</strong>
              <p>Review the page, the model, the changes, and the test results.</p>
            </li>
            <li>
              <span>PRINT</span>
              <strong>Print</strong>
              <p>Measure the light, slice the STL, and start with a fit test.</p>
            </li>
            <li>
              <span>SHARE</span>
              <strong>Share</strong>
              <p>Gift the light, tell its story, or help someone build another.</p>
            </li>
          </ol>
        </section>

        <section className="home-invitation">
          <div className="site-width">
            <p>Have a photo ready?</p>
            <Link href="/studio">Make the light</Link>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
