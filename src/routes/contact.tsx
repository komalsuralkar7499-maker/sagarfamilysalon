import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, Clock, CalendarCheck } from "lucide-react";
import {
  SALON,
  HAS_PHONE,
  HAS_WHATSAPP,
  HAS_ADDRESS,
  HAS_EMAIL,
  whatsappLink,
  displayPhone,
} from "@/lib/salon";
import { BookAppointmentCta } from "@/components/cta-buttons";
import { BookingForm } from "@/components/booking-form";
import storefrontAsset from "@/assets/storefront.asset.json";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book Appointment — Sagar Family Salon" },
      {
        name: "description",
        content:
          "Contact Sagar Family Salon in Malkapur, Maharashtra. Call or WhatsApp +91 78419 50095 to book your appointment for haircuts, colour, facials and bridal makeup.",
      },
      { property: "og:title", content: "Contact & Book Appointment — Sagar Family Salon" },
      {
        property: "og:description",
        content:
          "Book your appointment at Sagar Family Salon — haircuts, colour, facials and bridal makeup in Malkapur, Maharashtra.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Sagar Family Salon",
          description: "Book appointments and contact Sagar Family Salon in Malkapur.",
          mainEntity: {
            "@type": "HairSalon",
            name: SALON.name,
            telephone: SALON.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: "Hakimi Hospital Building, Hanuman Chowk, Near Maharashtra Bank",
              addressLocality: "Malkapur",
              addressRegion: "Maharashtra",
              postalCode: "443101",
              addressCountry: "IN",
            },
            url: "/contact",
          },
        }),
      },
    ],
  }),
  component: ContactPage,
});

function PlaceholderNote({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium italic text-muted-foreground">
      {label} — will be added soon
    </span>
  );
}

function ContactPage() {
  return (
    <>
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Book your <span className="text-gold-gradient">appointment</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-noir-muted">
            We'd love to welcome you to Sagar Family Salon. Reach out to
            reserve your slot or ask us anything.
          </p>
        </div>
        <div className="gold-rule mx-auto max-w-6xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:pt-20" aria-labelledby="booking-form-heading">
        <div className="rounded-3xl bg-card p-6 shadow-elegant sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="booking-form-heading" className="font-display text-3xl font-bold sm:text-4xl">
              Request an <span className="text-gold-gradient">appointment</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tell us what you need and when — we'll confirm your slot by email
              {HAS_WHATSAPP ? " or WhatsApp" : ""}.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="bg-noir py-16 text-noir-foreground sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-10 font-display text-4xl font-bold text-gold">
            Visit Us
          </h2>
          <div className="grid gap-7 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold">Address</h3>
                {HAS_ADDRESS ? (
                  <p className="mt-1 leading-relaxed text-noir-muted">
                    Sagar Family Salon,<br />
                    Hakimi Hospital Building,<br />
                    Hanuman Chowk, Near Maharashtra Bank,<br />
                    Malkapur, Maharashtra – 443101
                  </p>
                ) : (
                  <div className="mt-1">
                    <PlaceholderNote label="Salon address" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold">Phone</h3>
                {HAS_PHONE ? (
                  <a
                    href={`tel:${SALON.phone}`}
                    className="mt-1 inline-block text-lg font-semibold text-noir-foreground transition hover:text-gold"
                  >
                    {displayPhone(SALON.phone)}
                  </a>
                ) : (
                  <div className="mt-1">
                    <PlaceholderNote label="Phone number" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold">WhatsApp</h3>
                {HAS_WHATSAPP ? (
                  <a
                    href={whatsappLink("Hello Sagar Family Salon, I would like to book an appointment.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-noir-muted transition hover:text-gold"
                  >
                    Chat with us on WhatsApp
                  </a>
                ) : (
                  <div className="mt-1">
                    <PlaceholderNote label="WhatsApp number" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gold">Business Hours</h3>
                {SALON.hours ? (
                  <>
                    <p className="mt-1 text-noir-muted">Monday – Sunday</p>
                    <p className="text-noir-muted">10:00 AM – 8:00 PM</p>
                  </>
                ) : (
                  <div className="mt-1">
                    <PlaceholderNote label="Opening hours" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            {HAS_ADDRESS && SALON.mapsUrl ? (
              <a
                href={SALON.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-gold transition hover:bg-gold hover:text-noir"
              >
                <MapPin className="h-5 w-5" />
                Get Directions
              </a>
            ) : (
              <PlaceholderNote label="Google Maps directions" />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl shadow-elegant">
              <img
                src={storefrontAsset.url}
                alt="Sagar Family Salon storefront — find us here"
                className="h-full w-full object-cover"
                width={720}
                height={960}
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="rounded-2xl bg-noir p-8 text-center text-noir-foreground">
              <CalendarCheck className="mx-auto h-8 w-8 text-gold" />
              <h2 className="mt-3 font-display text-2xl font-bold">
                Ready when you are
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-noir-muted">
                Book ahead to skip the wait — especially on weekends and during
                wedding season.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <BookAppointmentCta />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
