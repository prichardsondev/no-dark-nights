import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "../SiteChrome";

export const metadata: Metadata = {
  title: "Learn | No Dark Nights",
  description:
    "Choose a simple path: make a night-light, build the complete project, or teach it with a group.",
};

const paths = [
  {
    number: "01",
    label: "Start here",
    title: "Make a night-light",
    text: "Use a photo on your own device to make a printable STL. No coding or AI conversation is required.",
    href: "/studio",
    action: "Open the Studio",
  },
  {
    number: "02",
    label: "Go deeper",
    title: "Build the whole project",
    text: "Follow one shared eight-step path from downloading the code to testing, printing, and reflecting.",
    href: "/learn/project",
    action: "Follow the eight steps",
  },
  {
    number: "03",
    label: "For groups",
    title: "Teach this project",
    text: "Prepare accounts, permissions, equipment, and a safe learning plan without creating a second curriculum.",
    href: "/learn/educators",
    action: "Open the educator guide",
  },
];

export default function LearnPage() {
  return (
    <SiteShell>
      <main className="learning-hub">
        <section className="learning-hub-intro site-width">
          <span>Choose one path</span>
          <h1>What do you want to make?</h1>
          <p>
            You do not need to understand the whole project before you begin.
            Pick the next useful thing and take it one step at a time.
          </p>
        </section>

        <section className="learning-path-grid site-width" aria-label="Learning paths">
          {paths.map((path) => (
            <Link href={path.href} key={path.href}>
              <span className="learning-path-number">{path.number}</span>
              <small>{path.label}</small>
              <h2>{path.title}</h2>
              <p>{path.text}</p>
              <strong>{path.action}</strong>
            </Link>
          ))}
        </section>

        <section className="learning-quick-start site-width">
          <div>
            <span>Making your first light</span>
            <h2>Three things to remember.</h2>
          </div>
          <ol>
            <li>
              <strong>Choose a photo you may use.</strong>
              <p>Keep the private source photo on your own device.</p>
            </li>
            <li>
              <strong>Make and check the STL.</strong>
              <p>Measure the light, frame the image, and inspect the model.</p>
            </li>
            <li>
              <strong>Fit-test before the full print.</strong>
              <p>Use adult help for printers, purchases, and electrical safety.</p>
            </li>
          </ol>
        </section>

        <section className="learning-reference-links site-width">
          <div>
            <span>Useful when you need it</span>
            <h2>Keep the reference material nearby—not in the way.</h2>
          </div>
          <nav aria-label="Learning references">
            <Link href="/resources">Parts and print guidance</Link>
            <Link href="/safety">Safety and privacy</Link>
            <Link href="/code">Understand the code</Link>
            <Link href="/grants">Grant Kit</Link>
          </nav>
        </section>
      </main>
    </SiteShell>
  );
}
