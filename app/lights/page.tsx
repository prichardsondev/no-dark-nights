import type { Metadata } from "next";
import { PageIntro, SiteShell } from "../SiteChrome";
import { lightListings, makerProfile } from "../maker-profile";

export const metadata: Metadata = {
  title: "Lights | No Dark Nights",
  description:
    "See example lithophane lights from the owner of this No Dark Nights site and learn how to contact the maker directly.",
};

export default function LightsPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Lights from this maker"
          title={`Made by ${makerProfile.studioName}.`}
          description="This page belongs to the owner of this site. It is not a marketplace or a directory of other makers."
        />

        <section className="maker-profile" aria-labelledby="maker-name">
          <div>
            <span className="site-eyebrow">Meet the maker</span>
            <h2 id="maker-name">{makerProfile.makerName}</h2>
          </div>
          <div>
            <p>{makerProfile.introduction}</p>
            {makerProfile.contactHref ? (
              <a
                href={makerProfile.contactHref}
                rel="noreferrer"
                target="_blank"
              >
                {makerProfile.contactLabel} ↗
              </a>
            ) : (
              <p className="contact-not-set">
                This maker has not added an adult-controlled contact link yet.
              </p>
            )}
          </div>
        </section>

        <section className="lights-section" aria-labelledby="available-lights">
          <div className="section-bar">
            <div>
              <span className="site-eyebrow">Sample offerings</span>
              <h2 id="available-lights">Lights this maker can offer.</h2>
            </div>
            <p className="example-note">
              These are example listings until the site owner replaces them.
            </p>
          </div>
          <div className="lights-grid">
            {lightListings.map((light) => (
              <article key={light.id} className="light-listing">
                <div className="light-listing-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={light.image} alt={light.alt} />
                  {light.isExample && <span>Example listing</span>}
                </div>
                <div className="light-listing-copy">
                  <div>
                    <h3>{light.title}</h3>
                    <p>{light.description}</p>
                  </div>
                  {light.offerLabel && <strong>{light.offerLabel}</strong>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="maker-arrangements" aria-label="Buying and gifts">
          <strong>Talk directly with this maker.</strong>
          <p>
            No Dark Nights does not provide checkout or process payments.
            Availability, gifts, prices, pickup, shipping, and payment—when
            applicable—are arranged directly with the adult owner of this site.
          </p>
        </aside>
      </main>
    </SiteShell>
  );
}
