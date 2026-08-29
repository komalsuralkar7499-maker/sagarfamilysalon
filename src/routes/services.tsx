import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, IndianRupee } from "lucide-react";

import {
  SALON,
  SERVICE_CATEGORIES,
  SERVICE_PRICES,
} from "@/lib/salon";

import {
  BookAppointmentCta,
  WhatsAppCta,
} from "@/components/cta-buttons";

import { SmartPriceEstimator } from "@/components/SmartPriceEstimator";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Sagar Family Salon" },
      {
        name: "description",
        content:
          "Explore haircut, hair colour, facial, makeup, bridal and hairstyling services with pricing at Sagar Family Salon, Malkapur, Maharashtra.",
      },
      {
        property: "og:title",
        content: "Services & Pricing — Sagar Family Salon",
      },
      {
        property: "og:description",
        content:
          "Haircuts, hair colour, facials, makeup, bridal services and hairstyling with transparent pricing.",
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
          name: "Services & Pricing at Sagar Family Salon",
          itemListElement: SERVICE_CATEGORIES.map((cat, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: cat.title,
              description: cat.description,
              provider: {
                "@type": "HairSalon",
                name: SALON.name,
              },
            },
          })),
        }),
      },
    ],
  }),

  component: ServicesPage,
});

function getServicePrice(
  categoryTitle: string,
  serviceName: string,
): number | null {
  const category = SERVICE_PRICES.find(
    (item) =>
      item.category.toLowerCase() ===
      categoryTitle.toLowerCase(),
  );

  if (!category) {
    return null;
  }

  const service = category.services.find(
    (item) =>
      item.name.toLowerCase() ===
      serviceName.toLowerCase(),
  );

  return service?.price ?? null;
}

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

function ServicesPage() {
  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Our services
          </p>

          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Everything your{" "}
            <span className="text-gold-gradient">
              hair &amp; skin
            </span>{" "}
            needs
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-noir-muted">
            Explore our salon services and transparent pricing.
            From everyday haircuts to bridal makeup, our team is
            here to help you look and feel your best.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <BookAppointmentCta />
            <WhatsAppCta />
          </div>
        </div>

        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      {/* =====================================================
          SERVICE OVERVIEW
      ====================================================== */}
      <section
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20"
        aria-labelledby="services-heading"
      >
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Services &amp; pricing
          </p>

          <h2
            id="services-heading"
            className="mt-3 font-display text-3xl font-bold sm:text-4xl"
          >
            Choose your{" "}
            <span className="text-gold-gradient">
              perfect service
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Prices shown are starting prices and may vary depending
            on hair length, product requirements, styling complexity
            and consultation.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((cat) => (
            <article
              key={cat.title}
              className="group flex flex-col rounded-2xl bg-card p-6 shadow-elegant transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-2xl font-semibold">
                  {cat.title}
                </h2>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <IndianRupee className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {cat.description}
              </p>

              <ul className="mt-5 space-y-3">
                {cat.services.map((service) => {
                  const price = getServicePrice(
                    cat.title,
                    service,
                  );

                  return (
                    <li
                      key={service}
                      className="flex items-center justify-between gap-3 border-b border-border/60 pb-2.5 text-sm last:border-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                        <span>{service}</span>
                      </div>

                      {price !== null && (
                        <span className="shrink-0 font-semibold text-primary">
                          {formatPrice(price)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Book {cat.title}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* =====================================================
          SMART PRICE ESTIMATOR
      ====================================================== */}
      <section
        id="price-estimator"
        className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-20"
      >
        <SmartPriceEstimator />
      </section>

      {/* =====================================================
          COMPLETE PRICE LIST
      ====================================================== */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Price menu
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Complete{" "}
              <span className="text-gold-gradient">
                service menu
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              A simple overview of our services and starting prices.
              Speak with our team for customised treatments and
              packages.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {SERVICE_PRICES.map((category) => (
              <article
                key={category.category}
                className="overflow-hidden rounded-2xl bg-card shadow-elegant"
              >
                <div className="bg-noir px-6 py-5 text-noir-foreground">
                  <h3 className="font-display text-2xl font-bold">
                    {category.category}
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {category.services.map((service) => (
                      <div
                        key={service.name}
                        className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-sm font-medium">
                          {service.name}
                        </span>

                        <span className="shrink-0 font-semibold text-primary">
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02]"
                  >
                    Book this service
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gold/30 bg-card p-5 text-center shadow-elegant">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">
                Please note:
              </strong>{" "}
              Prices are indicative starting prices. Final pricing
              may depend on hair length, thickness, product usage,
              treatment requirements and styling complexity.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          DETAILED FAQ
      ====================================================== */}
      <section
        className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20"
        aria-labelledby="faq-heading"
      >
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            In detail
          </p>

          <h2
            id="faq-heading"
            className="mt-3 font-display text-3xl font-bold sm:text-4xl"
          >
            What to expect,{" "}
            <span className="text-gold-gradient">
              answered
            </span>
          </h2>
        </div>

        <div className="mt-12 space-y-12">
          {SERVICE_CATEGORIES.map((cat) => (
            <article
              key={cat.id}
              id={cat.id}
              className="scroll-mt-24 rounded-3xl bg-card p-6 shadow-elegant sm:p-10"
            >
              <div>
                <h3 className="font-display text-2xl font-bold sm:text-3xl">
                  {cat.title}
                </h3>

                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
              </div>

              {/* SERVICES + PRICES */}
              <div className="mt-6 rounded-2xl bg-secondary/50 p-5">
                <h4 className="font-display text-lg font-semibold">
                  Services &amp; pricing
                </h4>

                <ul className="mt-4 space-y-3">
                  {cat.services.map((service) => {
                    const price = getServicePrice(
                      cat.title,
                      service,
                    );

                    return (
                      <li
                        key={service}
                        className="flex items-center justify-between gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-2.5 text-sm">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                          <span>{service}</span>
                        </div>

                        {price !== null && (
                          <span className="font-semibold text-primary">
                            {formatPrice(price)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* FAQ */}
              <h4 className="mt-8 font-display text-lg font-semibold">
                Frequently asked questions
              </h4>

              <Accordion
                type="single"
                collapsible
                className="mt-2"
              >
                {cat.faqs.map((faq, i) => (
                  <AccordionItem
                    key={faq.question}
                    value={`${cat.id}-${i}`}
                  >
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

        {/* ===================================================
            FINAL CTA
        ==================================================== */}
        <div className="mt-16 rounded-3xl bg-noir p-8 text-center text-noir-foreground sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold">
            Need help choosing?
          </p>

          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            Not sure what you need?
          </h2>

          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-noir-muted">
            Book a visit and our stylists can understand your
            requirements and recommend the right service for you.
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