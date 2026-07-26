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
