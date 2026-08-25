import { Link } from "@tanstack/react-router";
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Instagram,
  Youtube,
} from "lucide-react";
import {
  SALON,
  HAS_PHONE,
  HAS_WHATSAPP,
  HAS_ADDRESS,
  whatsappLink,
  displayPhone,
} from "@/lib/salon";

export function SiteFooter() {
  return (
    <footer className="bg-noir text-noir-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src={SALON.logo}
              alt="Sagar Family Salon logo"
              className="h-12 w-12 rounded-full object-cover ring-1 ring-gold/50"
              width={48}
              height={48}
              loading="lazy"
            />

            <p className="font-display text-lg font-semibold">
              Sagar <span className="text-gold-gradient">Family Salon</span>
            </p>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-noir-muted">
            {SALON.tagline}. Internationally certified experts in hair &amp;
            skin.
          </p>

          {/* Social Media */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.instagram.com/sagarsalon01/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sagar Family Salon on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:border-gold hover:bg-gold/10 hover:text-white"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href="https://youtube.com/@sagarsalon001"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Sagar Family Salon on YouTube"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:border-gold hover:bg-gold/10 hover:text-white"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Footer navigation">
          <h3 className="font-display text-base font-semibold text-gold">
            Explore
          </h3>

          <ul className="mt-4 space-y-2 text-sm text-noir-muted">
            <li>
              <Link to="/" className="hover:text-noir-foreground">
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-noir-foreground">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/services" className="hover:text-noir-foreground">
                Services
              </Link>
            </li>

            <li>
              <Link to="/gallery" className="hover:text-noir-foreground">
                Gallery
              </Link>
            </li>

            <li>
              <Link to="/bridal" className="hover:text-noir-foreground">
                Bridal &amp; Makeup
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-noir-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Services */}
        <div>
          <h3 className="font-display text-base font-semibold text-gold">
            Services
          </h3>

          <ul className="mt-4 space-y-2 text-sm text-noir-muted">
            <li>Haircut &amp; Styling</li>
            <li>Hair Colour</li>
            <li>Facial &amp; Cleanup</li>
            <li>Bridal Makeup</li>
          </ul>
        </div>

        {/* Visit Us */}
        <div>
          <h3 className="font-display text-base font-semibold text-gold">
            Visit Us
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-noir-muted">

            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />

              {HAS_ADDRESS ? (
                <span>{SALON.address}</span>
              ) : (
                <span className="italic">Address — to be added</span>
              )}
            </li>

            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />

              {HAS_PHONE ? (
                <a
                  href={`tel:${SALON.phone}`}
                  className="hover:text-noir-foreground"
                >
                  {displayPhone(SALON.phone)}
                </a>
              ) : (
                <span className="italic">Phone — to be added</span>
              )}
            </li>

            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />

              {HAS_WHATSAPP ? (
                <a
                  href={whatsappLink(
                    "Hello Sagar Family Salon, I would like to book an appointment."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-noir-foreground"
                >
                  Chat on WhatsApp
                </a>
              ) : (
                <span className="italic">
                  WhatsApp — to be added
                </span>
              )}
            </li>

            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />

              {SALON.hours ? (
                <span>{SALON.hours}</span>
              ) : (
                <span className="italic">
                  Business hours — to be added
                </span>
              )}
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-noir-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-noir-muted sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} Sagar Family Salon. All rights reserved.
          </p>

          <p>
            Internationally Certified · Expert in Hair &amp; Skin
          </p>
        </div>
      </div>
    </footer>
  );
}