import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, SiteShell } from "../SiteChrome";

const resources = [
  {
    number: "01",
    title: "Printer",
    text: "Any reliable FDM printer with a build height of at least 105 mm can make the default light. A clean bed and steady upright print matter more than a premium machine.",
  },
  {
    number: "02",
    title: "Material",
    text: "White PLA is the easiest starting point. Different brands transmit light differently, so keep a small test print and record the settings that work.",
  },
  {
    number: "03",
    title: "Light",
    text: "Our usual housing measures 16.5 mm across the slot. Measure your own light with calipers and update Slot width under Advanced settings before printing.",
  },
  {
    number: "04",
    title: "Slicer",
    text: "Keep the model upright on its adapter base. Start around a 0.16–0.20 mm layer height, use consistent walls, and preview every layer before sending it to the printer.",
  },
];

const whatWeUse = [
  {
    title: "Warm-white C7 / E12 LED bulbs",
    href: "https://www.amazon.com/dp/B06VTGDD33",
    text: "Use LED bulbs only, follow the light manufacturer’s instructions, and never substitute a hot incandescent bulb.",
  },
  {
    title: "Plug-in night-light modules",
    href: "https://www.amazon.com/dp/B078YCCTTJ",
    text: "These are the 16.5 mm style used for the default slot. Measure your actual housing before making the STL.",
  },
  {
    title: "Bambu Lab A1 mini",
    href: "https://us.store.bambulab.com/products/a1-mini",
    text: "An optional beginner-friendly printer example. A compatible printer you already have can work just as well.",
  },
  {
    title: "Bambu PLA Basic",
    href: "https://us.store.bambulab.com/products/pla-basic-filament",
    text: "White PLA on a spool is a practical starting material. Other white PLA can work; light transmission varies by brand.",
  },
];

export default function ResourcesPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Tools and materials"
          title="Printer, plastic, light, slicer."
          description="The project is intentionally printer- and brand-agnostic. These are practical starting points, not purchasing requirements."
        />
        <div className="resource-grid">
          {resources.map((resource) => (
            <article key={resource.number}>
              <span>{resource.number}</span>
              <h2>{resource.title}</h2>
              <p>{resource.text}</p>
            </article>
          ))}
        </div>
        <section className="what-we-use" aria-labelledby="what-we-use-title">
          <div className="what-we-use-heading">
            <span className="site-eyebrow">What we use</span>
            <h2 id="what-we-use-title">Real examples, not requirements.</h2>
            <p>
              These links show the parts used for our own lights and one printer
              and material combination we know. Equivalent compatible products
              can work.
            </p>
            <p className="affiliate-disclosure">
              <strong>No affiliate links.</strong> No Dark Nights does not earn
              money or receive commission from any link on this page.
            </p>
          </div>
          <div className="what-we-use-grid">
            {whatWeUse.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${item.title} in a new tab`}
                >
                  View example ↗
                </a>
              </article>
            ))}
          </div>
          <p className="disclosure-note">
            Prices and availability change. Measure for compatibility and
            follow each manufacturer&apos;s instructions.
          </p>
        </section>
        <section className="checklist-section">
          <div>
            <span className="site-eyebrow">Before a full print</span>
            <h2>Five-minute fit checklist</h2>
          </div>
          <ul>
            <li>Confirm STL height, width, and slot width in the slicer.</li>
            <li>Check that the model sits flat on the build plate.</li>
            <li>Preview the first layers around the rounded slot.</li>
            <li>Print a short adapter-only test when using a new light.</li>
            <li>Keep plug-in lights and finished prints away from excess heat.</li>
          </ul>
        </section>
        <section className="next-step">
          <div>
            <span className="site-eyebrow">Make the model</span>
            <h2>Your image never needs to leave your device.</h2>
            <p>
              The studio reads the photo locally and builds the STL in your
              browser.
            </p>
          </div>
          <Link href="/studio">Open the studio →</Link>
        </section>
      </main>
    </SiteShell>
  );
}
export const metadata: Metadata = {
  title: "Printing Resources | No Dark Nights",
  description:
    "Practical starting points for printers, white PLA, night-light housings, slicers, measurements, and fit tests.",
};
