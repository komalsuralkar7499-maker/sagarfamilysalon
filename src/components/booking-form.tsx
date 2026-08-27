import { useState, type FormEvent } from "react";
import { CalendarCheck, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import {
  HAS_WHATSAPP,
  SERVICE_CATEGORIES,
  whatsappLink,
} from "@/lib/salon";

import {
  bookingSchema,
  type BookingRequest,
} from "@/lib/booking-schema";

import { submitBooking } from "@/lib/booking.functions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPTY: BookingRequest = {
  name: "",
  phone: "",
  email: "",
  service: "",
  date: "",
  time: "",
  stylist: "",
  notes: "",
};

const TIME_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
];

const STYLISTS = [
  "Any Available Stylist",
  "Senior Stylist",
  "Hair Specialist",
  "Makeup & Bridal Specialist",
];

type FieldErrors = Partial<Record<keyof BookingRequest, string>>;

function buildWhatsAppMessage(b: BookingRequest): string {
  return [
    "Hello Sagar Family Salon, I would like to book an appointment.",
    "",
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Email: ${b.email}`,
    `Service: ${b.service}`,
    `Preferred date: ${b.date}`,
    `Preferred time: ${b.time}`,
    `Preferred stylist: ${b.stylist}`,
    b.notes?.trim() ? `Notes: ${b.notes.trim()}` : "",
    "",
    "Please confirm whether this slot is available.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function BookingForm() {
  const [values, setValues] = useState<BookingRequest>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);

  function set<K extends keyof BookingRequest>(
    key: K,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsed = bookingSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BookingRequest;

        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    setSending(true);

    let emailed = false;
    let confirmed = false;

    try {
      const result = await submitBooking({
        data: parsed.data,
      });

      emailed = result.emailed;
      confirmed = result.confirmationEmailed;
    } catch {
      emailed = false;
    }

    if (HAS_WHATSAPP) {
      window.open(
        whatsappLink(buildWhatsAppMessage(parsed.data)),
        "_blank",
        "noopener,noreferrer",
      );
    }

    setSending(false);
    setValues(EMPTY);
    setErrors({});

    const confirmationText = confirmed
      ? " A confirmation email has also been sent to you."
      : "";

    if (emailed && HAS_WHATSAPP) {
      toast.success("Appointment request sent!", {
        description:
          "The salon has received your details and WhatsApp is ready to send." +
          confirmationText,
      });
    } else if (emailed) {
      toast.success("Appointment request sent!", {
        description:
          "The salon has received your booking request by email." +
          confirmationText,
      });
    } else if (HAS_WHATSAPP) {
      toast.success("WhatsApp is ready!", {
        description:
          "Your complete appointment details are prefilled. Press Send to contact the salon.",
      });
    } else {
      toast.success("Appointment request submitted!", {
        description:
          "Please contact the salon to confirm the selected time.",
      });
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6"
    >
      {/* Name + Phone */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-name">
            Your name *
          </Label>

          <Input
            id="booking-name"
            value={values.name}
            onChange={(e) =>
              set("name", e.target.value)
            }
            placeholder="Full name"
            maxLength={100}
            autoComplete="name"
            aria-invalid={!!errors.name}
          />

          {errors.name && (
            <p className="text-sm text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-phone">
            Phone number *
          </Label>

          <Input
            id="booking-phone"
            type="tel"
            value={values.phone}
            onChange={(e) =>
              set("phone", e.target.value)
            }
            placeholder="+91 98765 43210"
            maxLength={20}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
          />

          {errors.phone && (
            <p className="text-sm text-destructive">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="booking-email">
          Email address *
        </Label>

        <Input
          id="booking-email"
          type="email"
          value={values.email}
          onChange={(e) =>
            set("email", e.target.value)
          }
          placeholder="you@example.com"
          maxLength={254}
          autoComplete="email"
          aria-invalid={!!errors.email}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          We'll send your appointment confirmation to this address.
        </p>
      </div>

      {/* Service */}
      <div className="space-y-2">
        <Label htmlFor="booking-service">
          Service *
        </Label>

        <Select
          value={values.service}
          onValueChange={(value) =>
            set("service", value)
          }
        >
          <SelectTrigger
            id="booking-service"
            aria-invalid={!!errors.service}
          >
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>

          <SelectContent>
            {SERVICE_CATEGORIES.map((category) => (
              <SelectItem
                key={category.id}
                value={category.title}
              >
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.service && (
          <p className="text-sm text-destructive">
            {errors.service}
          </p>
        )}
      </div>

      {/* Date + Time */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-date">
            Preferred date *
          </Label>

          <Input
            id="booking-date"
            type="date"
            min={today}
            value={values.date}
            onChange={(e) =>
              set("date", e.target.value)
            }
            aria-invalid={!!errors.date}
          />

          {errors.date && (
            <p className="text-sm text-destructive">
              {errors.date}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-time">
            Preferred time *
          </Label>

          <Select
            value={values.time}
            onValueChange={(value) =>
              set("time", value)
            }
          >
            <SelectTrigger
              id="booking-time"
              aria-invalid={!!errors.time}
            >
              <SelectValue placeholder="Choose a time" />
            </SelectTrigger>

            <SelectContent>
              {TIME_SLOTS.map((time) => (
                <SelectItem
                  key={time}
                  value={time}
                >
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.time && (
            <p className="text-sm text-destructive">
              {errors.time}
            </p>
          )}
        </div>
      </div>

      {/* Stylist */}
      <div className="space-y-2">
        <Label htmlFor="booking-stylist">
          Preferred stylist *
        </Label>

        <Select
          value={values.stylist}
          onValueChange={(value) =>
            set("stylist", value)
          }
        >
          <SelectTrigger
            id="booking-stylist"
            aria-invalid={!!errors.stylist}
          >
            <SelectValue placeholder="Choose a stylist" />
          </SelectTrigger>

          <SelectContent>
            {STYLISTS.map((stylist) => (
              <SelectItem
                key={stylist}
                value={stylist}
              >
                {stylist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.stylist && (
          <p className="text-sm text-destructive">
            {errors.stylist}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="booking-notes">
          Notes (optional)
        </Label>

        <Textarea
          id="booking-notes"
          value={values.notes ?? ""}
          onChange={(e) =>
            set("notes", e.target.value)
          }
          placeholder="Occasion, preferred look, special request..."
          maxLength={500}
          rows={4}
          aria-invalid={!!errors.notes}
        />

        {errors.notes && (
          <p className="text-sm text-destructive">
            {errors.notes}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {sending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : HAS_WHATSAPP ? (
          <MessageCircle className="h-5 w-5" />
        ) : (
          <CalendarCheck className="h-5 w-5" />
        )}

        {sending
          ? "Sending..."
          : "Request Appointment"}
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Your selected date, time, stylist and service
        will be sent to the salon for confirmation.
        No payment is taken online.
      </p>
    </form>
  );
}