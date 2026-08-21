import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GALLERY_IMAGES, type GalleryImage } from "@/lib/salon";
import { BookAppointmentCta } from "@/components/cta-buttons";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Sagar Family Salon" },
      {
        name: "description",
        content:
          "See real photos from Sagar Family Salon — our salon space, haircuts, hair colour, styling and happy guests.",
      },
      { property: "og:title", content: "Gallery — Sagar Family Salon" },
      {
        property: "og:description",
        content:
          "Real photos from Sagar Family Salon — our space, haircuts, colour work and happy guests.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

const FILTERS = ["All", "Salon", "Hair", "Styling"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(img: GalleryImage, filter: Filter): boolean {
  return filter === "All" || img.category === filter;
}

function GalleryPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = GALLERY_IMAGES.filter((img) => matchesFilter(img, filter));

  return (
    <>
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Gallery
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Real work, <span className="text-gold-gradient">real guests</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-noir-muted">
            A look inside our salon and at some of the cuts, colours and styles
            we've created for our guests.
          </p>
        </div>
        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter gallery">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow-gold"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-2 gap-4 lg:columns-3 [&>figure]:mb-4">
          {visible.map((img) => (
            <figure
              key={img.src}
              className="break-inside-avoid overflow-hidden rounded-xl shadow-elegant"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </figure>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-muted-foreground">
            Like what you see? Let us create your look next.
          </p>
          <div className="mt-6">
            <BookAppointmentCta />
          </div>
        </div>
      </section>
    </>
  );
}
