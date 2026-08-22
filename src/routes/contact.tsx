import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, Clock, CalendarCheck } from "lucide-react";
import {
  SALON,
  HAS_PHONE,
  HAS_WHATSAPP,
  HAS_ADDRESS,
  whatsappLink,
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
          "Contact Sagar Family Salon to book your appointment. Reach us by phone or WhatsApp for haircuts, colour, facials and bridal makeup.",
      },
      { property: "og:title", content: "Contact & Book Appointment — Sagar Family Salon" },
      {
        property: "og:description",
        content:
          "Book your appointment at Sagar Family Salon — haircuts, colour, facials and bridal makeup.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
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
              or WhatsApp.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <BookingForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl bg-card p-6 shadow-elegant">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-semibold">Call us</h2>
                {HAS_PHONE ? (
                  <a
                    href={`tel:${SALON.phone}`}
                    className="mt-1 block text-lg font-semibold text-primary hover:underline"
                  >
                    {SALON.phone}
                  </a>
                ) : (
                  <div className="mt-2">
                    <PlaceholderNote label="Phone number" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-card p-6 shadow-elegant">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-semibold">WhatsApp</h2>
                {HAS_WHATSAPP ? (
                  <a
                    href={whatsappLink("Hello Sagar Family Salon, I would like to book an appointment.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                ) : (
                  <div className="mt-2">
                    <PlaceholderNote label="WhatsApp number" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-card p-6 shadow-elegant">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-semibold">Visit us</h2>
                {HAS_ADDRESS ? (
                  <>
                    <p className="mt-1 text-muted-foreground">{SALON.address}</p>
                    {SALON.mapsUrl && (
                      <a
                        href={SALON.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block font-semibold text-primary hover:underline"
                      >
                        Open in Google Maps
                      </a>
                    )}
                  </>
                ) : (
                  <div className="mt-2">
                    <PlaceholderNote label="Salon address & map link" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-2xl bg-card p-6 shadow-elegant">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-semibold">Business hours</h2>
                {SALON.hours ? (
                  <p className="mt-1 text-muted-foreground">{SALON.hours}</p>
                ) : (
                  <div className="mt-2">
                    <PlaceholderNote label="Opening hours" />
                  </div>
                )}
              </div>
            </div>
          </div>

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
            <div className="mt-6 rounded-2xl bg-noir p-8 text-center text-noir-foreground">
              <CalendarCheck className="mx-auto h-8 w-8 text-gold" />
              <h2 className="mt-3 font-display text-2xl font-bold">
                Ready when you are
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-noir-muted">
                Book ahead to skip the wait — especially on weekends and during
                wedding season.
              </p>
              <div className="mt-6">
                <BookAppointmentCta />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
