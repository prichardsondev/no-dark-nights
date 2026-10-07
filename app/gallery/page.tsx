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
          description="Night lights made from photographs and illustrations. Personal photographs appear here only when sharing has been requested or approved."
        />
        <aside
          className="gallery-safety"
          aria-labelledby="gallery-safety-title"
        >
          <strong id="gallery-safety-title">
            Before adding a gallery photo
          </strong>
          <p>
            Get adult permission, remove EXIF and location metadata, and check
            for addresses, school names, uniforms, license plates, or
            recognizable locations. Use no full names or identifying filenames.
          </p>
        </aside>
        <GalleryCarousel items={allGalleryItems} />
      </main>
    </SiteShell>
  );
}
