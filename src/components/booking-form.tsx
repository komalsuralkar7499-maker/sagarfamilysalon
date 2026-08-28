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

type ExtraBookingDetails = {
  time: string;
  stylist: string;
  occasion: string;
};

type BookingFormValues = BookingRequest & ExtraBookingDetails;

const EMPTY: BookingFormValues = {
  name: "",
  phone: "",
  email: "",
  service: "",
  date: "",
  notes: "",
  time: "",
  stylist: "",
  occasion: "",
};

type FieldErrors = Partial<
  Record<keyof BookingFormValues, string>
>;

function buildWhatsAppMessage(
  booking: BookingFormValues
): string {
  const lines = [
    "✨ Hello Sagar Family Salon 👋",
    "",
    "I would like to request an appointment.",
    "",
    "━━━━━━━━━━━━━━━━",
    "👤 CUSTOMER DETAILS",
    "━━━━━━━━━━━━━━━━",
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    "",
    "━━━━━━━━━━━━━━━━",
    "💇 APPOINTMENT DETAILS",
    "━━━━━━━━━━━━━━━━",
    `Service: ${booking.service}`,
    `Preferred Date: ${
      booking.date || "Not specified"
    }`,
    `Preferred Time: ${
      booking.time || "Not specified"
    }`,
    `Preferred Stylist: ${
      booking.stylist || "Any stylist"
    }`,
    `Occasion / Requirement: ${
      booking.occasion || "Not specified"
    }`,
  ];

  if (booking.notes?.trim()) {
    lines.push(
      "",
      "━━━━━━━━━━━━━━━━",
      "📝 ADDITIONAL NOTES",
      "━━━━━━━━━━━━━━━━",
      booking.notes.trim()
    );
  }

  lines.push(
    "",
    "━━━━━━━━━━━━━━━━",
    "📌 Please confirm:",
    "• Whether the requested slot is available",
    "• Final service price",
    "• Expected service duration",
    "",
    "Thank you! 😊"
  );

  return lines.join("\n");
}

export function BookingForm() {
  const [values, setValues] =
    useState<BookingFormValues>(EMPTY);

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [sending, setSending] =
    useState(false);

  function set<K extends keyof BookingFormValues>(
    key: K,
    value: string
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

  async function onSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const parsed = bookingSchema.safeParse({
      name: values.name,
      phone: values.phone,
      email: values.email,
      service: values.service,
      date: values.date,
      notes: values.notes,
    });

    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const key =
          issue.path[0] as keyof BookingFormValues;

        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    if (!values.time) {
      setErrors({
        time: "Please choose a preferred time",
      });
      return;
    }

    if (!values.stylist) {
      setErrors({
        stylist: "Please choose a stylist preference",
      });
      return;
    }

    setSending(true);

    const whatsappMessage =
      buildWhatsAppMessage(values);

    /*
     * Open WhatsApp immediately after the user clicks
     * the button. This avoids mobile browser popup blocking.
     */
    let whatsappWindow: Window | null = null;

    if (HAS_WHATSAPP) {
      whatsappWindow = window.open(
        whatsappLink(whatsappMessage),
        "_blank"
      );
    }

    let emailed = false;
    let confirmationEmailed = false;

    try {
      const result = await submitBooking({
        data: parsed.data,
      });

      emailed = result.emailed;
      confirmationEmailed =
        result.confirmationEmailed;
    } catch (error) {
      console.error(
        "Booking submission failed:",
        error
      );
    }

    setSending(false);

    /*
     * Only clear the form after processing.
     */
    setValues(EMPTY);
    setErrors({});

    const confirmationMessage =
      confirmationEmailed
        ? " A confirmation email has also been sent."
        : "";

    if (emailed && HAS_WHATSAPP) {
      toast.success("Booking request prepared!", {
        description:
          "Your complete appointment details are ready in WhatsApp. Please press Send." +
          confirmationMessage,
      });
    } else if (emailed) {
      toast.success("Booking request received!", {
        description:
          "The salon has received your appointment request by email." +
          confirmationMessage,
      });
    } else if (HAS_WHATSAPP) {
      if (!whatsappWindow) {
        toast.info("WhatsApp is ready", {
          description:
            "Your appointment details are prepared. Please allow pop-ups or tap WhatsApp again.",
        });
      } else {
        toast.success("WhatsApp is ready!", {
          description:
            "Your complete booking details are prefilled. Please press Send.",
        });
      }
    } else {
      toast.success("Appointment request noted", {
        description:
          "Please contact Sagar Family Salon to confirm your appointment.",
      });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6"
    >
      {/* =========================
          CUSTOMER DETAILS
      ========================== */}

      <div>
        <h3 className="font-display text-xl font-semibold">
          Your Details
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Tell us how we can contact you.
        </p>
      </div>

      {/* NAME + PHONE */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-name">
            Full Name *
          </Label>

          <Input
            id="booking-name"
            value={values.name}
            onChange={(event) =>
              set("name", event.target.value)
            }
            placeholder="Enter your full name"
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
            Phone Number *
          </Label>

          <Input
            id="booking-phone"
            type="tel"
            value={values.phone}
            onChange={(event) =>
              set("phone", event.target.value)
            }
            placeholder="+91 XXXXX XXXXX"
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

      {/* EMAIL */}
      <div className="space-y-2">
        <Label htmlFor="booking-email">
          Email Address *
        </Label>

        <Input
          id="booking-email"
          type="email"
          value={values.email}
          onChange={(event) =>
            set("email", event.target.value)
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
          We'll use this for your appointment
          confirmation.
        </p>
      </div>

      {/* =========================
          APPOINTMENT DETAILS
      ========================== */}

      <div className="border-t pt-6">
        <h3 className="font-display text-xl font-semibold">
          Appointment Details
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose your service, date, time and stylist
          preference.
        </p>
      </div>

      {/* SERVICE */}
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

      {/* DATE + TIME */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-date">
            Preferred Date *
          </Label>

          <Input
            id="booking-date"
            type="date"
            value={values.date}
            min={new Date()
              .toISOString()
              .split("T")[0]}
            onChange={(event) =>
              set("date", event.target.value)
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
            Preferred Time *
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
              <SelectItem value="10: