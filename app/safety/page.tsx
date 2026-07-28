import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, SiteShell } from "../SiteChrome";
import { REPOSITORY_URL } from "../site-data";

export const metadata: Metadata = {
  title: "Safety & Privacy | No Dark Nights",
  description:
    "How No Dark Nights handles photographs, children’s information, publishing, purchases, and physical safety.",
};

export default function SafetyPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Safety & privacy"
          title="Keep the photo private. Let adults handle the public parts."
          description="A short guide for learners, families, educators, and site owners."
        />

        <div className="safety-grid">
          <section>
            <h2>Inside the Studio</h2>
            <ul>
              <li>No account is required to use the Studio.</li>
              <li>
                The application processes the source photograph locally and does
                not intentionally upload it.
              </li>
              <li>STL generation happens in the browser.</li>
              <li>
                Giving a photograph to Codex or another AI service is a separate
                action. Do not provide private photographs to Codex.
              </li>
            </ul>
          </section>

          <section>
            <h2>Children&apos;s information</h2>
            <ul>
              <li>
                The application does not intentionally collect children&apos;s
                contact information.
              </li>
              <li>
                Contact is disabled for learner sites. An adult site manager may
                add an adult-controlled contact method later.
              </li>
              <li>
                Adults control contact, purchasing, publication, and public
                accounts.
              </li>
            </ul>
          </section>

          <section>
            <h2>Normal hosting data</h2>
            <p>
              Hosting and security providers may process normal connection data,
              such as an IP address and browser information, and may set
              necessary security cookies. External services and links have their
              own privacy policies.
            </p>
          </section>

          <section>
            <h2>Report a concern</h2>
            <p>
              A trusted adult can report a safety, privacy, or security concern
              privately through the project&apos;s GitHub security page. Do not
              attach a private photograph or a child&apos;s contact information.
            </p>
            <a
              href={`${REPOSITORY_URL}/security`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open private reporting guidance ↗
            </a>
          </section>
        </div>

        <section className="next-step">
          <div>
            <span className="site-eyebrow">Use the tool safely</span>
            <h2>The Studio does not need your identity.</h2>
            <p>
              Choose a photograph on your own device, make the STL, and keep the
              original photograph out of prompts and repositories.
            </p>
          </div>
          <Link href="/studio">Open the Studio →</Link>
        </section>
      </main>
    </SiteShell>
  );
}
