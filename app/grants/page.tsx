import type { Metadata } from "next";
import Link from "next/link";
import { GrantActions } from "../GrantActions";
import { PageIntro, SiteShell } from "../SiteChrome";
import { REPOSITORY_URL } from "../site-data";

export const metadata: Metadata = {
  title: "Grant Kit | No Dark Nights",
  description:
    "A reusable program brief for funding a six-hour No Dark Nights AI, web-development, and 3D-printing learning lab.",
};

const programFacts = [
  "Two three-hour instructional sessions",
  "Supervised printing between sessions",
  "Beginner-friendly and project based",
  "Free, open-source curriculum",
  "Reusable technology stations",
  "Individual or small-team delivery",
  "Public publishing optional",
];

const learningAreas = [
  "AI-agent literacy",
  "Website development",
  "Git and GitHub",
  "Privacy and responsible publishing",
  "Image processing and 3D modeling",
  "Measurement, tolerance, and calibration",
  "Slicing and additive manufacturing",
  "Testing and troubleshooting",
  "Creative entrepreneurship",
  "Communication and community giving",
];

const learnerArtifacts = [
  "A personalized, working website",
  "A reviewed source repository and Git history",
  "A lithophane STL generated from their own site",
  "A Base Fit Lab calibration result",
  "A printed lithophane night-light",
  "A privacy-safe project story or short reflection",
  "A portfolio-ready explanation of the process",
];

const outcomes = [
  {
    outcome: "Guide an AI coding agent and review its work",
    evidence: "Prompt history, changed-file review, and learner explanation",
  },
  {
    outcome: "Run and personalize a web project",
    evidence: "Functioning local or hosted website",
  },
  {
    outcome: "Explain Git versus GitHub",
    evidence: "Reviewed commit and repository",
  },
  {
    outcome: "Apply privacy and consent practices",
    evidence: "Source-photo handling and publication checklist",
  },
  {
    outcome: "Generate and validate an STL",
    evidence: "STL, settings note, and automated checks",
  },
  {
    outcome: "Apply measurement and tolerance",
    evidence: "Labeled Fit Finder result and selected slot width",
  },
  {
    outcome: "Inspect a 3D print safely",
    evidence: "Completed print inspection checklist",
  },
  {
    outcome: "Explain how software became a physical product",
    evidence: "Short reflection, presentation, or portfolio story",
  },
];

export default function GrantsPage() {
  return (
    <SiteShell>
      <main className="content-page grant-page site-width">
        <PageIntro
          eyebrow="Grant Kit"
          title="A six-hour, project-based AI and 3D-printing program"
          description="Two three-hour instructional sessions, with supervised printing between sessions. Each learner finishes with a working website, its reviewed source code, a calibrated printable STL, a physical lithophane night-light, and a portfolio-ready explanation of what they built and learned."
        />

        <section className="grant-facts" aria-label="Program summary">
          {programFacts.map((fact, index) => (
            <div key={fact}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{fact}</strong>
            </div>
          ))}
        </section>

        <section
          className="grant-section grant-value"
          aria-labelledby="value-title"
        >
          <div className="grant-section-heading">
            <span className="site-eyebrow">Why the program is fundable</span>
            <h2 id="value-title">
              One understandable artifact connects the learning.
            </h2>
            <p>
              Learners do not merely watch a technology demonstration. They
              create working software, review its source code, manufacture a
              physical product, and document the complete idea-to-production
              process.
            </p>
          </div>
          <div className="grant-value-grid">
            <ul className="grant-tag-list" aria-label="Learning areas">
              {learningAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
            <div className="grant-connections">
              <h3>Natural program connections</h3>
              <p>
                STEM · Career and technical education · AI literacy · Additive
                manufacturing · Digital citizenship · Workforce readiness · Art
                and design · Entrepreneurship · Community engagement
              </p>
            </div>
          </div>
        </section>

        <section className="grant-section" aria-labelledby="artifacts-title">
          <div className="grant-section-heading">
            <span className="site-eyebrow">Physical evidence of learning</span>
            <h2 id="artifacts-title">What each learner produces</h2>
          </div>
          <div className="grant-artifact-grid">
            {learnerArtifacts.map((artifact, index) => (
              <article key={artifact}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{artifact}</h3>
              </article>
            ))}
          </div>
          <p className="grant-note">
            The school or program normally retains the reusable computer and
            printer station. Learners take their digital work, source code,
            physical light, and evidence of learning. Public deployment,
            personal photographs, purchases, and public gallery participation
            remain optional.
          </p>
        </section>

        <section className="grant-section" aria-labelledby="delivery-title">
          <div className="grant-section-heading">
            <span className="site-eyebrow">Adaptable delivery model</span>
            <h2 id="delivery-title">
              Two sessions, with printing between them.
            </h2>
            <p>
              This is a practical starting model, not a rigid requirement.
              Facilitators can adjust pacing, team size, and local-only
              milestones to fit their learners and facilities.
            </p>
          </div>
          <div className="grant-timeline">
            <article>
              <span>Session 1 · three hours</span>
              <h3>Build and prepare</h3>
              <ul>
                <li>Introduce AI-agent use, consent, and privacy</li>
                <li>Open or clone the project and run it locally</li>
                <li>Inspect and personalize the site</li>
                <li>Review changes and save them with Git</li>
                <li>Use the Base Fit Lab</li>
                <li>Print and test the Fit Finder</li>
                <li>Select the correct adapter size</li>
                <li>Generate and inspect the final STL</li>
                <li>Prepare the print in the slicer</li>
              </ul>
            </article>
            <article className="grant-print-period">
              <span>Between sessions</span>
              <h3>Supervised print period</h3>
              <p>
                Complete lithophanes may take longer than the instructional
                session. Printing occurs during an instructor-managed or
                otherwise appropriately supervised period. Programs follow
                printer, material, facility, and manufacturer policies.
              </p>
            </article>
            <article>
              <span>Session 2 · three hours</span>
              <h3>Finish, inspect, and explain</h3>
              <ul>
                <li>Inspect the completed print</li>
                <li>Troubleshoot fit or quality problems</li>
                <li>Test the cooled print on the unplugged light</li>
                <li>Complete and review the website</li>
                <li>Publish an approved version when appropriate</li>
                <li>Create a privacy-safe project story</li>
                <li>Explain what changed, what worked, and what was learned</li>
                <li>Discuss community, portfolio, or small-enterprise uses</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="grant-section" aria-labelledby="outcomes-title">
          <div className="grant-section-heading">
            <span className="site-eyebrow">Measurable learning outcomes</span>
            <h2 id="outcomes-title">
              Outcomes paired with observable evidence.
            </h2>
            <p>
              By completion, learners should be able to demonstrate these
              skills. The program gives each learner the opportunity to create
              the evidence below; it does not promise identical mastery for
              every participant.
            </p>
          </div>
          <div className="grant-table-wrap">
            <table className="grant-outcomes-table">
              <thead>
                <tr>
                  <th scope="col">Outcome</th>
                  <th scope="col">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {outcomes.map(({ outcome, evidence }) => (
                  <tr key={outcome}>
                    <td>{outcome}</td>
                    <td>{evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          className="grant-section grant-split"
          aria-label="Evaluation and access"
        >
          <article>
            <span className="site-eyebrow">Evaluation approach</span>
            <h2>Count the work, then ask learners to explain it.</h2>
            <ul>
              <li>Completion of key digital and physical artifacts</li>
              <li>A simple instructor rubric</li>
              <li>Learner reflection</li>
              <li>Pre/post confidence questions</li>
              <li>Attendance and completion counts</li>
              <li>
                Counts of functioning sites, validated STLs, Fit Finder tests,
                and completed prints
              </li>
              <li>Optional follow-up project or presentation</li>
            </ul>
            <p className="grant-note">
              No Dark Nights has not yet published formal pilot results.
              Outcomes and evaluation measures on this page are proposed for a
              future program to validate.
            </p>
          </article>
          <article>
            <span className="site-eyebrow">
              Access, equity, and flexibility
            </span>
            <h2>Ownership of equipment is not a prerequisite.</h2>
            <ul>
              <li>Learners do not need to own a computer or printer.</li>
              <li>Equipment can be reused by later cohorts.</li>
              <li>Calipers are optional.</li>
              <li>
                Neutral or permission-cleared images may replace personal
                photographs.
              </li>
              <li>A public website is not required for completion.</li>
              <li>
                A physical print is optional when accessibility or program
                circumstances prevent it.
              </li>
              <li>Meaningful local-only milestones remain available.</li>
              <li>Work may be completed individually or in small teams.</li>
              <li>
                Families and educators determine appropriate guidance beyond
                applicable service requirements.
              </li>
              <li>The curriculum and source code are open and adaptable.</li>
            </ul>
          </article>
        </section>

        <section className="grant-section" aria-labelledby="station-title">
          <div className="grant-section-heading">
            <span className="site-eyebrow">Reusable equipment</span>
            <h2 id="station-title">Suggested learning station</h2>
            <p>
              Named products are examples, not requirements. Existing school,
              library, or makerspace equipment may be used.
            </p>
          </div>
          <div className="grant-station-grid">
            <ul>
              <li>Mac mini or comparable supported computer</li>
              <li>
                Bambu Lab A1 Mini or comparable beginner-friendly 3D printer
              </li>
              <li>
                Codex desktop access or an approved managed Codex environment
              </li>
              <li>PLA filament</li>
              <li>Commercially manufactured LED night-light hardware</li>
            </ul>
            <ul>
              <li>Internet access</li>
              <li>Slicer software</li>
              <li>Basic finishing and safety supplies</li>
              <li>
                Calipers optional—the Base Fit Lab provides a no-caliper path
              </li>
              <li>
                Product links elsewhere on this site are not affiliate links
              </li>
            </ul>
          </div>
          <p className="grant-note">
            Bedrock-managed local Codex work and OpenAI-hosted Sites publishing
            may require separate access arrangements, as explained on{" "}
            <Link href="/learn#school-lab-setup">Learn</Link>. Never give
            learners root credentials, shared permanent credentials, or
            unrestricted cloud spending.
          </p>
        </section>

        <section className="grant-section" aria-labelledby="budget-title">
          <div className="grant-section-heading">
            <span className="site-eyebrow">Reusable budget framework</span>
            <h2 id="budget-title">Use current quotes and local rates.</h2>
            <p>
              Most initial funding supports reusable equipment. Ongoing expenses
              are primarily managed AI access, filament, night-light hardware,
              replacement supplies, and program delivery.
            </p>
          </div>
          <div className="grant-budget-grid">
            <article>
              <h3>Reusable equipment</h3>
              <ul>
                <li>Computers</li>
                <li>3D printers</li>
                <li>Storage and workstation accessories</li>
                <li>Optional measuring and finishing tools</li>
                <li>Spare parts or maintenance allowance</li>
              </ul>
            </article>
            <article>
              <h3>Per-learner or recurring costs</h3>
              <ul>
                <li>Filament</li>
                <li>LED night-light hardware</li>
                <li>Replacement supplies</li>
                <li>Managed AI/Codex access</li>
                <li>Printing and finishing materials</li>
              </ul>
            </article>
            <article>
              <h3>Program delivery</h3>
              <ul>
                <li>Instructor or facilitator time</li>
                <li>Curriculum preparation</li>
                <li>Technical setup and support</li>
                <li>Accessibility accommodations</li>
                <li>
                  Shipping, tax, or institutional purchasing costs where
                  applicable
                </li>
              </ul>
            </article>
          </div>
          <p className="grant-note">
            Applicants should insert current vendor quotes, institutional
            pricing, and local staffing rates. This framework intentionally
            contains no estimated retail prices.
          </p>
        </section>

        <section
          className="grant-section grant-safety"
          aria-labelledby="grant-safety-title"
        >
          <div>
            <span className="site-eyebrow">Safety and privacy</span>
            <h2 id="grant-safety-title">Build with deliberate boundaries.</h2>
          </div>
          <ul>
            <li>Source photos remain local in Studio.</li>
            <li>Private photographs should not be given to Codex.</li>
            <li>Contact is disabled in repository clones.</li>
            <li>Public publishing requires deliberate review.</li>
            <li>
              Fit tests happen only after cooling and with the light unplugged.
            </li>
            <li>Electrical components are never printed or modified.</li>
            <li>
              Programs follow applicable age, account, facility, printer, and
              manufacturer requirements.
            </li>
          </ul>
          <Link href="/safety">Review Safety &amp; Privacy →</Link>
        </section>

        <GrantActions />

        <section className="grant-next" aria-labelledby="grant-next-title">
          <div>
            <span className="site-eyebrow">Continue exploring</span>
            <h2 id="grant-next-title">See every part of the program.</h2>
          </div>
          <div className="grant-next-links">
            <Link href="/learn">Explore the learning path</Link>
            <Link href="/studio">Try the Studio</Link>
            <Link href="/studio#base-fit-lab">Open the Base Fit Lab</Link>
            <Link href="/safety">Review Safety &amp; Privacy</Link>
            <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              View the source code ↗
            </a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
