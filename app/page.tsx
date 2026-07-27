import Link from "next/link";
import { SiteShell } from "./SiteChrome";
import { galleryItems } from "./site-data";

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="home-opening site-width">
          <div className="opening-copy">
            <span className="site-eyebrow">
              A night-light studio and hands-on learning project
            </span>
            <h1>Make a light. Learn how the whole thing works.</h1>
            <p>
              No Dark Nights turns a photo into a printable lithophane. Use the
              Studio immediately, see lights from this maker, or build your own
              version of the entire site.
            </p>
          </div>
          <div className="opening-actions" aria-label="Start here">
            <Link className="start-card" href="/lights">
              <span>01</span>
              <strong>Buy a Light</strong>
              <p>
                See lights created by this maker. Purchase one or ask about
                receiving one as a gift.
              </p>
              <i>View Lights</i>
            </Link>
            <Link className="start-card primary" href="/studio">
              <span>02</span>
              <strong>Make an STL</strong>
              <p>
                Turn a photo into a downloadable lithophane STL using the
                Studio. No coding or AI agent required.
              </p>
              <i>Open the Studio</i>
            </Link>
            <Link className="start-card" href="/learn#step-1">
              <span>03</span>
              <strong>Build Your Own Site</strong>
              <p>
                Learn AI agents, web development, Git, GitHub, Sites, and 3D
                printing by creating your own version.
              </p>
              <i>Start Learning</i>
            </Link>
          </div>
        </section>

        <section className="education-brief site-width">
          <div className="education-intro">
            <span className="site-eyebrow">Use it or build it</span>
            <h2>A real project with two ways in.</h2>
            <p>
              Anyone can make an STL in the Studio. Learners can go further and
              build, personalize, test, and publish their own copy with an AI
              agent guiding each step.
            </p>
          </div>
          <div className="participation-levels">
            <article>
              <span>For everyone</span>
              <h3>Use the Studio</h3>
              <p>No coding, agent, account, or programming experience needed.</p>
              <Link href="/studio">Make an STL →</Link>
            </article>
            <article>
              <span>For learners</span>
              <h3>Build your own</h3>
              <p>Follow seven agent-guided steps from source code to print.</p>
              <Link href="/learn">See the learning path →</Link>
            </article>
          </div>
          <ul className="learning-topics" aria-label="What the project teaches">
            <li>AI agent literacy</li>
            <li>Web development</li>
            <li>Git and GitHub</li>
            <li>Image and 3D-model processing</li>
            <li>3D printing</li>
            <li>Design and iteration</li>
            <li>Entrepreneurship and community giving</li>
            <li>Privacy, consent, and responsible publishing</li>
          </ul>
        </section>

        <section className="compact-story site-width">
          <div>
            <span className="site-eyebrow">The point</span>
            <h2>Make one. Give one. Teach one.</h2>
          </div>
          <div>
            <p>
              Each deployed copy belongs to its maker. The owner can offer
              lights directly, give them away, and share the complete process:
              the Studio, code, prompts, tests, and lessons.
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
                <div className="gallery-image-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} />
                </div>
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
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
