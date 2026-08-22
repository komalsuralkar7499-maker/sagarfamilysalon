import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Scissors,
  Sparkles,
  Palette,
  Flower2,
  Heart,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { SALON, GALLERY_IMAGES } from "@/lib/salon";
import { BookAppointmentCta, WhatsAppCta } from "@/components/cta-buttons";
import storefrontAsset from "@/assets/storefront.asset.json";
import interiorChairsAsset from "@/assets/interior-chairs.asset.json";
import workBalayageAsset from "@/assets/work-balayage.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sagar Family Salon — Expert Hair & Skin Care" },
      {
        name: "description",
        content:
          "Sagar Family Salon — internationally certified experts in hair & skin. Haircuts, hair colour, facials and bridal makeup for the whole family.",
      },
      { property: "og:title", content: "Sagar Family Salon — Expert Hair & Skin Care" },
      {
        property: "og:description",
        content:
          "Internationally certified experts in hair & skin. Haircuts, colour, facials and bridal makeup for the whole family.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const FEATURED_SERVICES = [
  {
    icon: Scissors,
    title: "Haircut & Styling",
    text: "Precision cuts for men, women and kids, finished with professional styling.",
  },
  {
    icon: Palette,
    title: "Hair Colour",
    text: "Global colour, highlights and balayage with professional colour ranges.",
  },
  {
    icon: Sparkles,
    title: "Facial & Cleanup",
    text: "Signature facials and Hydra Beauty treatments for glowing skin.",
  },
  {
    icon: Heart,
    title: "Bridal Makeup",
    text: "Complete bridal looks — HD makeup, hairstyling and draping.",
  },
];

const WHY_US = [
  {
    icon: Award,
    title: "Internationally Certified",
    text: "Trained and certified expertise in hair & skin care.",
  },
  {
    icon: Users,
    title: "For the Whole Family",
    text: "Men, women and kids — everyone is welcome at our family salon.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene First",
    text: "Clean stations, sanitized tools and professional products.",
  },
  {
    icon: Flower2,
    title: "Modern Equipment",
    text: "Advanced skin and hair technology, including Hydra Beauty systems.",
  },
];

function HomePage() {
  const galleryPreview = GALLERY_IMAGES.slice(1, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-noir text-noir-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Internationally Certified
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Sagar <span className="text-gold-gradient">Family Salon</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-noir-muted">
              {SALON.tagline}. From everyday haircuts to your bridal day — we
              make every visit special.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <BookAppointmentCta />
              <WhatsAppCta />
            </div>
          </div>
          <div className="relative animate-fade-up">
            <div className="overflow-hidden rounded-2xl shadow-elegant ring-1 ring-gold/30">
              <img
                src={storefrontAsset.url}
                alt="Sagar Family Salon storefront — internationally certified experts in hair & skin"
                className="h-full w-full object-cover"
                width={720}
                height={960}
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={interiorChairsAsset.url}
              alt="Styling chairs and workstations inside Sagar Family Salon"
              className="h-full w-full object-cover"
              width={720}
              height={960}
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Welcome
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              A salon the whole family can trust
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              At Sagar Family Salon, we combine internationally certified
              expertise with warm, personal care. Whether it's a quick trim, a
              fresh hair colour, a relaxing facial or your bridal makeover, our
              team takes the time to understand exactly what you want.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              We use professional products and modern equipment in a clean,
              comfortable space — so you leave looking and feeling your best.
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              More about us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              What we do
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Featured Services
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_SERVICES.map((s) => (
              <article
                key={s.title}
                className="rounded-2xl bg-card p-6 shadow-elegant transition-transform hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.text}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-7 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Why choose us
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              The Sagar Family Salon difference
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((w) => (
              <div key={w.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                  <w.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-noir-muted">
                  {w.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Our work
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              From our salon
            </h2>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            View full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {galleryPreview.map((img) => (
            <div
              key={img.src}
              className="overflow-hidden rounded-xl shadow-elegant"
            >
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
      </section>

      {/* Bridal highlight */}
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Bridal &amp; Makeup
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Your big day, perfected
            </h2>
            <p className="mt-5 leading-relaxed text-noir-muted">
              From HD bridal makeup to elegant bridal hairstyles, party makeup
              and eye makeup — our makeup artists craft looks that photograph
              beautifully and last all day.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/bridal"
                className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
              >
                Explore bridal services
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-elegant ring-1 ring-gold/30">
            <img
              src={workBalayageAsset.url}
              alt="Caramel balayage highlights with soft curls by Sagar Family Salon"
              className="h-full w-full object-cover"
              width={710}
              height={1078}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Contact / location */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="rounded-3xl bg-card p-8 text-center shadow-elegant sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Visit us
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Book your appointment today
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Walk-ins are welcome, but we recommend booking ahead so we can give
            you our full attention. Reach out to reserve your slot.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <BookAppointmentCta />
            <WhatsAppCta />
          </div>
        </div>
      </section>
    </>
  );
}
