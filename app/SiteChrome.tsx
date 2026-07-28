import Link from "next/link";
import { navigation, REPOSITORY_URL } from "./site-data";

export function SiteHeader() {
  return (
    <header className="ndn-header">
      <Link className="ndn-brand" href="/" aria-label="No Dark Nights home">
        <span>
          <strong>
            No Dark Nights<span className="brand-dot">.</span>
          </strong>
          <small>Make · learn · share</small>
        </span>
      </Link>
      <nav className="ndn-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <Link
            className={item.primary ? "primary-nav-link" : undefined}
            key={item.href}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-action" href="/studio">
        Make an STL
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="ndn-footer">
      <div>
        <strong>No Dark Nights</strong>
        <p>Make one. Give one. Teach one.</p>
      </div>
      <div className="footer-links">
        <Link href="/lights">This maker’s lights</Link>
        <Link href="/studio">Make an STL</Link>
        <Link href="/about">Our story</Link>
        <Link href="/learn">Start learning</Link>
        <Link href="/resources">Print safely</Link>
        <Link href="/safety">Safety &amp; privacy</Link>
        <a href={REPOSITORY_URL} rel="noreferrer" target="_blank">
          GitHub source
        </a>
      </div>
      <p className="footer-note">
        Photos are shown only with permission. The studio keeps source images on
        your device.
      </p>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-intro">
      <span className="site-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
