import { PageIntro, SiteShell } from "../SiteChrome";
import { galleryItems } from "../site-data";

export default function GalleryPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Gallery"
          title="Every light begins with someone or something worth remembering."
          description="A few finished pieces from No Dark Nights. Personal photographs are shown only when sharing has been requested or approved."
        />
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <figure
              key={item.src}
              className={index === 0 || index === 5 ? "wide" : ""}
            >
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

