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
          title="Finished night lights."
          description="A collection of No Dark Nights lithophane night lights I’ve made from photographs and illustrations."
        />
        <GalleryCarousel items={allGalleryItems} />
      </main>
    </SiteShell>
  );
}
