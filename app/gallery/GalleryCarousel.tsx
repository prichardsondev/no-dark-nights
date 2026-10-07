"use client";

import { useRef, useState } from "react";

type GalleryItem = {
  src: string;
  title: string;
  alt: string;
};

export function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLElement>(null);

  const keepCurrentLightInView = () => {
    requestAnimationFrame(() => {
      carouselRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
    keepCurrentLightInView();
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
    keepCurrentLightInView();
  };

  return (
    <section
      ref={carouselRef}
      className="gallery-carousel"
      aria-label="Finished night-light gallery"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
    >
      <div className="gallery-carousel-stage">
        <div
          className="gallery-carousel-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <figure
              className="gallery-carousel-slide"
              key={item.src}
              aria-hidden={index !== activeIndex}
            >
              <div className="gallery-carousel-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="gallery-carousel-controls">
        <button type="button" onClick={showPrevious} aria-label="Previous light">
          Previous
        </button>
        <p aria-live="polite" aria-atomic="true">
          <strong>{items[activeIndex]?.title}</strong>
          <span>
            {activeIndex + 1} of {items.length}
          </span>
        </p>
        <button type="button" onClick={showNext} aria-label="Next light">
          Next
        </button>
      </div>

      <div className="gallery-carousel-thumbnails" aria-label="Choose a light">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.src}
            className={index === activeIndex ? "is-active" : undefined}
            aria-label={`Show ${item.title}`}
            aria-pressed={index === activeIndex}
            onClick={() => {
              setActiveIndex(index);
              keepCurrentLightInView();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <p className="gallery-carousel-hint">
        Use the arrow keys, buttons, or thumbnails to browse every light.
      </p>
    </section>
  );
}
