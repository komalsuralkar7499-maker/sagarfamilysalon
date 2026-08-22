import { createFileRoute } from "@tanstack/react-router";
import { Check, Heart } from "lucide-react";
import { GALLERY_IMAGES } from "@/lib/salon";
import { BookAppointmentCta, WhatsAppCta } from "@/components/cta-buttons";
import workBalayageAsset from "@/assets/work-balayage.asset.json";
import workWomensCutAsset from "@/assets/work-womens-cut.asset.json";
import workBangsAsset from "@/assets/work-bangs.asset.json";

export const Route = createFileRoute("/bridal")({
  head: () => ({
    meta: [
      { title: "Bridal & Makeup — Sagar Family Salon" },
      {
        name: "description",
        content:
          "Bridal makeup, party makeup, eye makeup, hairstyling and bridal hairstyles at Sagar Family Salon. Book your bridal consultation today.",
      },
      { property: "og:title", content: "Bridal & Makeup — Sagar Family Salon" },
      {
        property: "og:description",
        content:
          "Bridal makeup, party makeup, eye makeup and bridal hairstyling — book your consultation at Sagar Family Salon.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/bridal" },
    ],
    links: [{ rel: "canonical", href: "/bridal" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Bridal Makeup & Hairstyling",
          description:
            "Complete bridal experience — HD makeup, hairstyling, draping and pre-bridal packages.",
          provider: { "@type": "HairSalon", name: "Sagar Family Salon" },
        }),
      },
    ],
  }),
  component: BridalPage,
});

const BRIDAL_SERVICES = [
  {
    title: "Bridal Makeup",
    items: ["HD bridal makeup", "Long-lasting base", "Lashes & finishing", "Touch-up guidance"],
  },
  {
    title: "Party Makeup",
    items: ["Soft glam looks", "Evening party makeup", "Engagement makeup", "Guest-of-honour looks"],
  },
  {
    title: "Eye Makeup",
    items: ["Smokey eyes", "Soft shimmer eyes", "Defined liner looks", "Lash styling"],
  },
  {
    title: "Hairstyling",
    items: ["Bridal buns & updos", "Soft curls & waves", "Braids & accessorised styles", "Occasion hairstyling"],
  },
];

function BridalPage() {
  const portfolio = GALLERY_IMAGES.filter((i) => i.category !== "Salon").slice(0, 6);

  return (
    <>
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Bridal &amp; Makeup
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Look unforgettable on your <span className="text-gold-gradient">big day</span>
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-noir-muted">
              Our makeup artists and hairstylists craft bridal looks that feel
              like you — only more radiant. Every bridal booking starts with a
              personal consultation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <BookAppointmentCta />
              <WhatsAppCta />
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-elegant ring-1 ring-gold/30">
            <img
              src={workBalayageAsset.url}
              alt="Elegant styled hair with caramel highlights by Sagar Family Salon"
              className="h-full w-full object-cover"
              width={710}
              height={1078}
              loading="lazy"
            />
          </div>
        </div>
        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Bridal &amp; makeup services
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Packages are customised to your event, outfit and preferences —
            contact us for details and availability.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BRIDAL_SERVICES.map((s) => (
            <article key={s.title} className="rounded-2xl bg-card p-6 shadow-elegant">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Makeup &amp; styling portfolio
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {portfolio.map((img) => (
              <div key={img.src} className="overflow-hidden rounded-xl shadow-elegant">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105"
                  width={540}
                  height={720}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl shadow-elegant">
              <img
                src={workWomensCutAsset.url}
                alt="Women's haircut and styling at Sagar Family Salon"
                className="aspect-[3/4] w-full object-cover"
                width={540}
                height={720}
                loading="lazy"
              />
            </div>
            <div className="mt-8 overflow-hidden rounded-xl shadow-elegant">
              <img
                src={workBangsAsset.url}
                alt="Haircut with curtain bangs styled at Sagar Family Salon"
                className="aspect-[3/4] w-full object-cover"
                width={540}
                height={720}
                loading="lazy"
              />
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Reserve your bridal date
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Wedding dates fill up quickly, especially in season. Book a
              consultation early so we can plan your look, schedule a trial and
              reserve your date.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <BookAppointmentCta />
              <WhatsAppCta />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
