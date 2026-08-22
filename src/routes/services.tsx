import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SALON, SERVICE_CATEGORIES } from "@/lib/salon";
import { BookAppointmentCta, WhatsAppCta } from "@/components/cta-buttons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Sagar Family Salon" },
      {
        name: "description",
        content:
          "Haircuts & styling, hair colour, facials & cleanups, makeup and bridal services at Sagar Family Salon.",
      },
      { property: "og:title", content: "Services — Sagar Family Salon" },
      {
        property: "og:description",
        content:
          "Haircuts, hair colour, facials, makeup and bridal services for the whole family.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Services at Sagar Family Salon",
          itemListElement: SERVICE_CATEGORIES.map((cat, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: cat.title,
              description: cat.description,
              provider: { "@type": "HairSalon", name: SALON.name },
            },
          })),
        }),
      },
    ],
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
              <a
                href={`#${cat.id}`}
                className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Details & FAQs →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:pb-20">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            In detail
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            What to expect, <span className="text-gold-gradient">answered</span>
          </h2>
        </div>

        <div className="mt-12 space-y-12">
          {SERVICE_CATEGORIES.map((cat) => (
            <article
              key={cat.id}
              id={cat.id}
              className="scroll-mt-24 rounded-3xl bg-card p-6 shadow-elegant sm:p-10"
            >
              <h3 className="font-display text-2xl font-bold sm:text-3xl">
                {cat.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {cat.description}
              </p>
              <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {cat.services.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <h4 className="mt-8 font-display text-lg font-semibold">
                Frequently asked questions
              </h4>
              <Accordion type="single" collapsible className="mt-2">
                {cat.faqs.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`${cat.id}-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
                >
                  Book {cat.title}
                </Link>
              </div>
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
