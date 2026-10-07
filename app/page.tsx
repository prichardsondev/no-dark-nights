import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "./SiteChrome";

export const metadata: Metadata = {
  title: "No Dark Nights | Learning Project",
  description:
    "Make a printable lithophane STL or follow the beginner-friendly No Dark Nights learning project.",
};

const startingPoints = [
  {
    number: "01",
    label: "Use the tool",
    title: "Make a night-light",
    text: "Turn a photo on your device into a printable STL. No coding is required.",
    href: "/studio",
    action: "Open the Studio",
  },
  {
    number: "02",
    label: "Learn by building",
    title: "Follow the project",
    text: "Use eight guided steps to understand, personalize, test, and print your own version.",
    href: "/learn",
    action: "Choose a learning path",
  },
  {
    number: "03",
    label: "Read the source",
    title: "Understand the code",
    text: "See how the website, local photo processing, geometry, and tests fit together.",
    href: "/code",
    action: "Open the code guide",
  },
];

export default function Home() {
  return (
    <SiteShell>
      <main className="learning-hub">
        <section className="learning-hub-intro site-width">
          <span>No Dark Nights learning project</span>
          <h1>Make one. Give one. Teach one.</h1>
          <p>
            Start with the working Studio or learn how the complete project was
            built. Personal maker photographs and showcase content live in each
            site owner&apos;s deployment—not in this learning copy.
          </p>
        </section>
        <section className="learning-path-grid site-width" aria-label="Start here">
          {startingPoints.map((point) => (
            <Link href={point.href} key={point.href}>
              <span className="learning-path-number">{point.number}</span>
              <small>{point.label}</small>
              <h2>{point.title}</h2>
              <p>{point.text}</p>
              <strong>{point.action}</strong>
            </Link>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}
