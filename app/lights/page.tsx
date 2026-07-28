import type { Metadata } from "next";
import { PageIntro, SiteShell } from "../SiteChrome";
import {
  getMailtoAddress,
  isValidContactHref,
  lightListings,
  makerProfile,
} from "../maker-profile";

export const metadata: Metadata = {
  title: "Lights | No Dark Nights",
  description:
    "See lithophane lights from this maker and use an adult-controlled contact method to ask about creating one.",
};

export default function LightsPage() {
  const hasContactMethod = isValidContactHref(makerProfile.contactHref);
  const contactEmail = getMailtoAddress(makerProfile.contactHref);

  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Lights from this maker"
          title={`Made by ${makerProfile.studioName}.`}
          description="See something you like? Contact the maker to ask about creating one from your photograph or artwork."
        />

        <section className="maker-profile" aria-labelledby="maker-name">
          <div>
            <span className="site-eyebrow">Meet the maker</span>
            <h2 id="maker-name">{makerProfile.makerName}</h2>
          </div>
          <div>
            <p>{makerProfile.introduction}</p>
            {hasContactMethod ? (
              <a
                href={makerProfile.contactHref}
                rel={contactEmail ? undefined : "noreferrer"}
                target={contactEmail ? undefined : "_blank"}
              >
                {makerProfile.contactLabel} ↗
              </a>
            ) : (
              <p className="contact-not-set">
                An adult-controlled contact method has not been configured yet.
              </p>
            )}
            {contactEmail && (
              <div className="contact-details">
                <p>
                  This opens an email addressed to{" "}
                  <strong>{contactEmail}</strong>.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="lights-section" aria-labelledby="available-lights">
          <div className="section-bar">
            <div>
              <h2 id="available-lights">Lights I can make</h2>
            </div>
          </div>
          <div className="lights-grid">
            {lightListings.map((light) => (
              <article key={light.id} className="light-listing">
                <div className="light-listing-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={light.image} alt={light.alt} />
                </div>
                <div className="light-listing-copy">
                  <h3>{light.title}</h3>
                  <p>{light.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="maker-arrangements" aria-labelledby="contact-title">
          <strong id="contact-title">Interested in a light?</strong>
          <p>
            Contact the adult who manages this site. There is no online
            checkout. Availability, cost, pickup, shipping, and payment—when
            applicable—are arranged directly with the maker.
          </p>
        </aside>

        <aside className="maker-safety" aria-labelledby="maker-safety-title">
          <strong id="maker-safety-title">For parents and young makers</strong>
          <p>
            Use a parent, guardian, teacher, school, makerspace, or other trusted
            adult&apos;s contact method. Never publish a child&apos;s personal
            email, phone number, full name, school details, or home address.
            Adults should arrange pickup or shipping using a safe public
            location, approved organization address, business address, or post
            office box—not a child&apos;s home address.
          </p>
        </aside>
      </main>
    </SiteShell>
  );
}
