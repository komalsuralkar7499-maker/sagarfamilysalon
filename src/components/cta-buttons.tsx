import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { HAS_WHATSAPP, whatsappLink } from "@/lib/salon";

export function BookAppointmentCta({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/contact"
      className={`inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03] ${className}`}
    >
      Book Appointment
    </Link>
  );
}

export function WhatsAppCta({ className = "" }: { className?: string }) {
  if (!HAS_WHATSAPP) {
    return (
      <span
        className={`inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-gold/50 px-7 py-3 text-base font-semibold text-gold/70 ${className}`}
        title="WhatsApp number will be added soon"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp — coming soon
      </span>
    );
  }
  return (
    <a
      href={whatsappLink("Hello Sagar Family Salon, I would like to book an appointment.")}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-gold px-7 py-3 text-base font-semibold text-gold transition-colors hover:bg-gold hover:text-noir ${className}`}
    >
      <MessageCircle className="h-5 w-5" />
      Chat on WhatsApp
    </a>
  );
}
