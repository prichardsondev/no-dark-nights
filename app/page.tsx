import type { Metadata } from "next";
import Link from "next/link";
import { getMakerProfile, isValidContactHref } from "./maker-profile";
import { allGalleryItems } from "./site-data";

export const metadata: Metadata = {
  title: "No Dark Nights | Custom lithophane night-lights",
  description:
    "See custom lithophane night-lights we've made, get in touch about a light, or learn how to make your own.",
};

export default function Home() {
  const profile = getMakerProfile();
  const hasContactMethod = isValidContactHref(profile.contactHref);

  return (
    <div className="showcase-home">
      <header className="showcase-header">
        <Link className="showcase-wordmark" href="/">
          No Dark Nights
        </Link>
        <nav aria-label="Showcase navigation">
          <a href="#lights">Our night-lights</a>
          <Link href="/gallery">Full gallery</Link>
          <Link href="/learn">Learn to make one</Link>
        </nav>
      </header>

      <main>
        <section className="showcase-hero site-width">
          <div className="showcase-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/no-dark-nights-trees-refreshed.png"
              alt="No Dark Nights tree artwork under a moonlit sky"
              width="1448"
              height="1086"
              fetchPriority="high"
            />
          </div>
          <div className="showcase-hero-copy">
            <span className="showcase-kicker">Custom lithophane night-lights</span>
            <h1>A favorite photo, made to glow.</h1>
            <p>
              Custom lithophane night lights made from photographs and
              illustrations that mean something to the people receiving them.
              Each one is printed and finished one at a time.
            </p>
            <div className="showcase-actions">
              <a className="showcase-primary-action" href="#lights">
                See the night-lights
              </a>
              {hasContactMethod && (
                <a className="showcase-secondary-action" href={profile.contactHref}>
                  {profile.contactLabel}
                </a>
              )}
            </div>
            <p className="showcase-note">
              No storefront and no posted prices—just a direct conversation
              about the light you have in mind.
            </p>
          </div>
        </section>

        <section className="showcase-lights" id="lights">
          <div className="showcase-section-heading site-width">
            <div>
              <span>Made in the No Dark Nights studio</span>
              <h2>Night-lights we&apos;ve made.</h2>
            </div>
            <p>
              Portraits, pets, celebrations, artwork, and the wonderfully odd
              ideas that become even better with a little light behind them.
            </p>
          </div>
          <div className="showcase-grid site-width">
            {allGalleryItems.map((item, index) => (
              <figure key={item.src}>
                <div className="showcase-image-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="showcase-contact site-width">
          <div>
            <span>Have an idea for a light?</span>
            <h2>Start with the photo that makes you smile.</h2>
          </div>
          <div>
            <p>
              We can talk through the image, the look, and what would make it
              feel personal. Availability and arrangements are handled
              directly—not through an online checkout.
            </p>
            {hasContactMethod ? (
              <a href={profile.contactHref}>{profile.contactLabel}</a>
            ) : (
              <p className="showcase-contact-unavailable">
                Contact is added by the adult who manages this site.
              </p>
            )}
          </div>
        </section>

        <section className="showcase-learning">
          <div className="site-width">
            <div>
              <span>Want to build one yourself?</span>
              <h2>The learning project lives right next door.</h2>
              <p>
                Follow the process, make a printable STL, or use the lessons to
                build your own version of No Dark Nights.
              </p>
            </div>
            <div className="showcase-learning-links">
              <Link href="/learn">Explore the learning project</Link>
              <Link href="/studio">Make an STL</Link>
              <a
                href="https://youtu.be/lXu6jsWt9qw"
                target="_blank"
                rel="noreferrer"
              >
                Watch the process
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="showcase-footer">
        <div className="site-width">
          <div>
            <strong>No Dark Nights</strong>
            <p>Make one. Give one. Teach one.</p>
          </div>
          <div>
            <Link href="/about">Our story</Link>
            <Link href="/safety">Safety &amp; privacy</Link>
            <Link href="/gallery">Gallery</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
