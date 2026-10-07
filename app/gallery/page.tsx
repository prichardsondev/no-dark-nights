import type { Metadata } from "next";
import { PageIntro, SiteShell } from "../SiteChrome";
import { allGalleryItems } from "../site-data";
import { GalleryCarousel } from "./GalleryCarousel";

export const metadata: Metadata = {
  title: "Gallery | No Dark Nights",
  description:
    "See finished No Dark Nights lithophane night lights made from photographs and illustrations shared with permission.",
};

export default function GalleryPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Gallery"
          title="A gallery belongs to its maker."
          description="The downloadable learning project does not include another maker’s personal photographs."
        />
        <GalleryCarousel items={allGalleryItems} />
      </main>
    </SiteShell>
  );
}
