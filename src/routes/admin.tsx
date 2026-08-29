import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
  XCircle,
  TrendingUp,
  IndianRupee,
  RefreshCw,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  stylist: string;
  occasion: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
};

const STORAGE_KEY = "sagar-family-salon-bookings";

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "demo-1",
    name: "Komal",
    phone: "7499634069",
    email: "komalsuralkar7499@gmail.com",
    service: "Facial & Cleanup",
    date: "2026-08-29",
    time: "12:00 PM",
    stylist: "Skin Specialist",
    occasion: "Regular appointment",
    notes: "❤️",
    status: "Pending",
    createdAt: "2026-08-28T10:00:00",
  },
  {
    id: "demo-2",
    name: "Mohit",
    phone: "7499634069",
    email: "komalsuralkar7499@gmail.com",
    service: "Hair Colour",
    date: "2026-08-30",
    time: "2:00 PM",
    stylist: "Hair Specialist",
    occasion: "Regular appointment",
    notes: "",
    status: "Confirmed",
    createdAt: "2026-08-28T11:00:00",
  },
];

function readBookings(): Booking[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEMO_BOOKINGS;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return DEMO_BOOKINGS;
    }

    return parsed;
  } catch {
    return DEMO_BOOKINGS;
  }
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function formatDate(date: string) {
  if (!date) return "—";

  const parts = date.split("-");

  if (parts.length !== 3) return date;

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatCreatedAt(date: string) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return date;
  }
}

function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<"All" | BookingStatus>("All");

  useEffect(() => {
    const stored = readBookings();

    setBookings(stored);

    if (!localStorage.getItem(STORAGE_KEY)) {
      saveBookings(DEMO_BOOKINGS);
    }
  }, []);

  const stats = useMemo(() => {
    return {
      total: bookings.length,

      pending: bookings.filter(
        (booking) => booking.status === "Pending",
      ).length,

      confirmed: bookings.filter(
        (booking) => booking.status === "Confirmed",
      ).length,

      completed: bookings.filter(
        (booking) => booking.status === "Completed",
      ).length,

      cancelled: bookings.filter(
        (booking) => booking.status === "Cancelled",
      ).length,

      customers: new Set(
        bookings.map((booking) => booking.phone),
      ).size,
    };
  }, [bookings]);

  const serviceStats = useMemo(() => {
    const counts: Record<string, number> = {};

    bookings.forEach((booking) => {
      counts[booking.service] =
        (counts[booking.service] || 0) + 1;
    });

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    );
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (filter === "All") {
      return bookings;
    }

    return bookings.filter(
      (booking) => booking.status === filter,
    );
  }, [bookings, filter]);

  function updateStatus(
    id: string,
    status: BookingStatus,
  ) {
    const updated = bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status }
        : booking,
    );

    setBookings(updated);
    saveBookings(updated);
  }

  function refreshBookings() {
    setBookings(readBookings());
  }

  function clearAllBookings() {
    const confirmed = window.confirm(
      "Remove all dashboard bookings? This cannot be undone.",
    );

    if (!confirmed) return;

    setBookings([]);
    saveBookings([]);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* HEADER */}
      <section className="bg-noir text-noir-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                Sagar Family Salon
              </p>

              <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
                Owner Dashboard
              </h1>

              <p className="mt-3 text-noir-muted">
                Manage bookings, customers and salon enquiries.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={refreshBookings}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-noir"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <button
                type="button"
                onClick={clearAllBookings}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/40 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
              >
                <XCircle className="h-4 w-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.total}
            icon={<CalendarDays className="h-5 w-5" />}
          />

          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<Clock3 className="h-5 w-5" />}
          />

          <StatCard
            title="Confirmed"
            value={stats.confirmed}
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <StatCard
            title="Customers"
            value={stats.customers}
            icon={<Users className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* POPULAR SERVICES */}
          <div className="rounded-3xl bg-card p-6 shadow-elegant">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold">
                  Popular Services
                </h2>

                <p className="text-xs text-muted-foreground">
                  Based on booking requests
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {serviceStats.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No booking data yet.
                </p>
              ) : (
                serviceStats.map(([service, count], index) => {
                  const percentage =
                    bookings.length > 0
                      ? Math.round(
                          (count / bookings.length) * 100,
                        )
                      : 0;

                  return (
                    <div key={service}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">
                          {service}
                        </span>

                        <span className="text-sm font-bold text-primary">
                          {count}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      {index === 0 && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Most requested service
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* STATUS */}
          <div className="rounded-3xl bg-card p-6 shadow-elegant">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-display text-xl font-bold">
                  Booking Status
                </h2>

                <p className="text-xs text-muted-foreground">
                  Current appointment pipeline
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <StatusRow
                label="Pending"
                value={stats.pending}
              />

              <StatusRow
                label="Confirmed"
                value={stats.confirmed}
              />

              <StatusRow
                label="Completed"
                value={stats.completed}
              />

              <StatusRow
                label="Cancelled"
                value={stats.cancelled}
              />
            </div>
          </div>

          {/* BUSINESS INSIGHTS */}
          <div className="rounded-3xl bg-noir p-6 text-noir-foreground shadow-elegant">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15">
              <IndianRupee className="h-5 w-5 text-gold" />
            </div>

            <h2 className="mt-5 font-display text-2xl font-bold">
              Smart Business Insights
            </h2>

            <p className="mt-3 text-sm leading-6 text-noir-muted">
              Your dashboard is ready for bookings, customers,
              service popularity and enquiry tracking.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gold/20 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gold">
                  Customers
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {stats.customers}
                </p>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wider text-gold">
                  Completed
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKINGS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Appointment management
            </p>

            <h2 className="mt-2 font-display text-3xl font-bold">
              Bookings
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "All",
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled",
              ] as const
            ).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  filter === item
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-card shadow-elegant">
          {filteredBookings.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 font-display text-xl font-bold">
                No bookings found
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                New appointment requests will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onStatusChange={updateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gold/20 bg-secondary/50 p-5 text-center">
          <p className="text-xs leading-5 text-muted-foreground">
            Dashboard data is currently stored locally in this
            browser. For a real multi-device owner dashboard with
            secure login, permanent bookings and live analytics,
            connect this dashboard to a backend/database next.
          </p>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-elegant">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>

        <span className="text-3xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-muted-foreground">
        {title}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-bold">
        {value}
      </span>
    </div>
  );
}

function BookingCard({
  booking,
  onStatusChange,
}: {
  booking: Booking;
  onStatusChange: (
    id: string,
    status: BookingStatus,
  ) => void;
}) {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* CUSTOMER DETAILS */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-xl font-bold">
              {booking.name}
            </h3>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {booking.status}
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a
                href={`tel:${booking.phone}`}
                className="hover:text-primary"
              >
                {booking.phone}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a
                href={`mailto:${booking.email}`}
                className="truncate hover:text-primary"
              >
                {booking.email}
              </a>
            </div>

            <p>
              💇 <span className="font-medium text-foreground">
                {booking.service}
              </span>
            </p>

            <p>
              📅 {formatDate(booking.date)} • {booking.time}
            </p>

            <p>
              👤 {booking.stylist || "Any Specialist"}
            </p>

            <p>
              🎉 {booking.occasion || "Not specified"}
            </p>
          </div>

          {booking.notes && (
            <div className="mt-4 rounded-2xl bg-secondary/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Additional notes
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {booking.notes}
              </p>
            </div>
          )}

          <p className="mt-3 text-xs text-muted-foreground">
            Request received: {formatCreatedAt(booking.createdAt)}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
          <a
            href={`https://wa.me/91${booking.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <a
            href={`tel:${booking.phone}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:bg-secondary"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>

          <button
            type="button"
            onClick={() =>
              onStatusChange(booking.id, "Confirmed")
            }
            disabled={booking.status === "Confirmed"}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirm
          </button>

          <button
            type="button"
            onClick={() =>
              onStatusChange(booking.id, "Completed")
            }
            disabled={booking.status === "Completed"}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Complete
          </button>

          <button
            type="button"
            onClick={() =>
              onStatusChange(booking.id, "Cancelled")
            }
            disabled={booking.status === "Cancelled"}
            className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}