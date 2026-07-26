import Link from "next/link";
import { PageIntro, SiteShell } from "../SiteChrome";

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Our story"
          title="Made for smiles, then opened for everyone."
          description="No Dark Nights makes custom lithophane night lights and gives many of them away. The next step is giving away the process too."
        />
        <div className="about-grid">
          <section>
            <h2>Why lights?</h2>
            <p>
              A lithophane looks quiet until light passes through it. Then a
              familiar face, pet, place, or moment appears. It is technical
              enough to teach with and personal enough to matter.
            </p>
          </section>
          <section>
            <h2>Why open the project?</h2>
            <p>
              The most interesting part is not selling another object. It is
              helping someone move from an idea, to a conversation with an AI
              agent, to code, to a working physical thing.
            </p>
          </section>
          <section>
            <h2>What stays important?</h2>
            <p>
              Permission before sharing personal photographs. Adult guidance
              for publishing. Honest testing before plugging anything into a
              wall. And enough curiosity to improve one version at a time.
            </p>
          </section>
        </div>
        <blockquote className="mission-quote">
          <p>Learn with AI. Build something real. Share the light.</p>
        </blockquote>
        <section className="next-step">
          <div>
            <span className="site-eyebrow">Join the idea</span>
            <h2>Make one. Give one. Teach one.</h2>
          </div>
          <Link href="/learn">Start the learning path →</Link>
        </section>
      </main>
    </SiteShell>
  );
}

