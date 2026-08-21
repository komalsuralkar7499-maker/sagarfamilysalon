import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { SALON } from "@/lib/salon";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/bridal", label: "Bridal & Makeup" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-noir/95 backdrop-blur supports-[backdrop-filter]:bg-noir/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="Sagar Family Salon — home"
          onClick={() => setOpen(false)}
        >
          <img
            src={SALON.logo}
            alt="Sagar Family Salon logo"
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gold/50"
            width={40}
            height={40}
          />
          <span className="truncate font-display text-lg font-semibold tracking-wide text-noir-foreground">
            Sagar <span className="text-gold-gradient">Family Salon</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3.5 py-2 text-sm font-medium tracking-wide transition-colors ${
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-noir-muted hover:text-noir-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className="ml-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
          >
            Book Appointment
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-noir-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-noir-foreground/10 bg-noir px-4 pb-6 pt-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-3 text-base font-medium ${
                  active ? "bg-gold/15 text-gold" : "text-noir-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-primary px-5 py-3 text-center text-base font-semibold text-primary-foreground shadow-gold"
          >
            Book Appointment
          </Link>
        </nav>
      )}
    </header>
  );
}
