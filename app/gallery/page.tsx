import { PageIntro, SiteShell } from "../SiteChrome";
import { galleryItems } from "../site-data";

export default function GalleryPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Gallery"
          title="Finished night lights."
          description="Eight lights made from photographs and illustrations. Personal photographs appear here only when sharing has been requested or approved."
        />
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <figure key={item.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} />
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
