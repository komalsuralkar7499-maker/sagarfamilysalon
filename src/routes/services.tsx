import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/salon";
import { BookAppointmentCta, WhatsAppCta } from "@/components/cta-buttons";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Sagar Family Salon" },
      {
        name: "description",
        content:
          "Haircuts & styling, hair colour, facials & cleanups, waxing, manicure & pedicure, makeup and bridal services at Sagar Family Salon.",
      },
      { property: "og:title", content: "Services — Sagar Family Salon" },
      {
        property: "og:description",
        content:
          "Haircuts, hair colour, facials, waxing, manicure, pedicure, makeup and bridal services for the whole family.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Our services
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Everything your <span className="text-gold-gradient">hair &amp; skin</span> needs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-noir-muted">
            Explore our full range of salon services. For pricing and packages,
            please contact us directly — we'll happily recommend what's right
            for you.
          </p>
        </div>
        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <article
              key={cat.title}
              className="flex flex-col rounded-2xl bg-card p-6 shadow-elegant transition-transform hover:-translate-y-1"
            >
              <h2 className="font-display text-2xl font-semibold">{cat.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {cat.description}
              </p>
              <ul className="mt-5 space-y-2.5">
                {cat.services.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-noir p-8 text-center text-noir-foreground sm:p-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Not sure what you need?
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-noir-muted">
            Book a visit and our stylists will consult with you before we
            begin — no obligation, just honest advice.
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
