import type { Metadata } from "next";
import { PageIntro, SiteShell } from "../SiteChrome";
import { galleryItems, originalGalleryItems } from "../site-data";

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
          description="Current lights and restored examples from the original No Dark Nights site. Personal photographs appear here only when sharing has been requested or approved."
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
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <figure key={item.src}>
              <div className="gallery-image-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>

        <section
          className="original-gallery-section"
          aria-labelledby="original-gallery-title"
        >
          <div className="original-gallery-heading">
            <span className="site-eyebrow">From the original site</span>
            <h2 id="original-gallery-title">Where No Dark Nights began.</h2>
            <p>
              These early examples and the original tree artwork have been
              restored from the first No Dark Nights website. The old pricing
              and contact details are intentionally not included.
            </p>
          </div>

          <figure className="original-brand-art">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/original-no-dark-nights-trees.webp"
              alt="Original No Dark Nights artwork showing a silhouetted tree"
            />
            <figcaption>Original No Dark Nights artwork</figcaption>
          </figure>

          <div className="gallery-grid original-gallery-grid">
            {originalGalleryItems.map((item, index) => (
              <figure key={item.src}>
                <div className="gallery-image-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} />
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
