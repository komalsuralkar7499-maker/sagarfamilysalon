import { useState, type FormEvent } from "react";
import {
  CalendarCheck,
  Loader2,
  MessageCircle,
} from "lucide-react";
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

type BookingFormValues = BookingRequest & {
  time: string;
  stylist: string;
  occasion: string;
};

type FieldErrors = Partial<
  Record<keyof BookingFormValues, string>
>;

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

const TIME_OPTIONS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

const STYLIST_OPTIONS = [
  "Any Specialist",
  "Hair Specialist",
  "Skin Specialist",
  "Makeup Artist",
  "Bridal Specialist",
];

const OCCASION_OPTIONS = [
  "Regular appointment",
  "Party / Event",
  "Wedding / Bridal",
  "Engagement",
  "Special occasion",
  "Other",
];

function formatDate(date: string): string {
  if (!date) return "Not specified";

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

function buildWhatsAppMessage(
  booking: BookingFormValues,
): string {
  const lines = [
    "Hello Sagar Family Salon 👋",
    "",
    "I would like to book an appointment.",
    "",
    "👤 Customer Details",
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    "",
    "💇 Appointment Details",
    `Service: ${booking.service}`,
    `Preferred date: ${formatDate(booking.date)}`,
    `Preferred time: ${booking.time}`,
    `Preferred specialist: ${booking.stylist}`,
    `Occasion / requirement: ${
      booking.occasion || "Not specified"
    }`,
  ];

  if (booking.notes.trim()) {
    lines.push(
      "",
      "📝 Additional Notes",
      booking.notes.trim(),
    );
  }

  lines.push(
    "",
    "Please confirm whether this date and time slot is available.",
    "",
    "Thank you!",
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

  function setField(
    key: keyof BookingFormValues,
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

  async function onSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    /*
     * IMPORTANT:
     * We intentionally do NOT use native `required`
     * validation. Radix Select can create hidden inputs
     * that sometimes trigger "Required" even when the
     * visible option is selected.
     */

    const baseData: BookingRequest = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      service: values.service.trim(),
      date: values.date.trim(),
      notes: values.notes.trim(),
    };

    const parsed =
      bookingSchema.safeParse(baseData);

    const nextErrors: FieldErrors = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field =
          issue.path[0] as keyof BookingFormValues;

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
    }

    if (!values.time) {
      nextErrors.time =
        "Please choose a preferred time";
    }

    if (!values.stylist) {
      nextErrors.stylist =
        "Please choose a preferred specialist";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);

      toast.error("Please complete the required fields.", {
        description:
          "Choose a service, date, time and specialist.",
      });

      return;
    }

    /*
     * WhatsApp is opened BEFORE the async server request.
     * This prevents mobile browsers from blocking the popup.
     */
    if (HAS_WHATSAPP) {
      const message =
        buildWhatsAppMessage(values);

      const whatsappUrl =
        whatsappLink(message);

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer",
      );
    }

    setSending(true);

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
        error,
      );
    }

    setSending(false);

    if (emailed) {
      toast.success("Appointment request sent!", {
        description:
          HAS_WHATSAPP
            ? "WhatsApp has your complete booking details. Just press Send."
            : confirmationEmailed
              ? "The salon has received your request."
              : "Your request has been submitted.",
      });
    } else if (HAS_WHATSAPP) {
      toast.success("WhatsApp is ready!", {
        description:
          "Your complete booking details are prefilled. Just press Send.",
      });
    } else {
      toast.success("Booking details noted.", {
        description:
          "Please contact the salon to confirm your appointment.",
      });
    }

    setValues(EMPTY);
    setErrors({});
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-6"
    >
      {/* NAME + PHONE */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-name">
            Your name *
          </Label>

          <Input
            id="booking-name"
            type="text"
            value={values.name}
            onChange={(event) =>
              setField(
                "name",
                event.target.value,
              )
            }
            placeholder="Full name"
            maxLength={100}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
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
            onChange={(event) =>
              setField(
                "phone",
                event.target.value,
              )
            }
            placeholder="+91 9876543210"
            maxLength={20}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
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
          Email address *
        </Label>

        <Input
          id="booking-email"
          type="email"
          value={values.email}
          onChange={(event) =>
            setField(
              "email",
              event.target.value,
            )
          }
          placeholder="you@example.com"
          maxLength={254}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          We'll send your appointment confirmation
          to this address.
        </p>
      </div>

      {/* SERVICE + DATE */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* SERVICE */}
        <div className="space-y-2">
          <Label htmlFor="booking-service">
            Service *
          </Label>

          <Select
            value={values.service}
            onValueChange={(value) =>
              setField("service", value)
            }
          >
            <SelectTrigger
              id="booking-service"
              aria-invalid={Boolean(
                errors.service,
              )}
            >
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>

            <SelectContent>
              {SERVICE_CATEGORIES.map(
                (category) => (
                  <SelectItem
                    key={category.id}
                    value={category.title}
                  >
                    {category.title}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {errors.service && (
            <p className="text-sm text-destructive">
              {errors.service}
            </p>
          )}
        </div>

        {/* DATE */}
        <div className="space-y-2">
          <Label htmlFor="booking-date">
            Preferred date *
          </Label>

          <Input
            id="booking-date"
            type="date"
            value={values.date}
            onChange={(event) =>
              setField(
                "date",
                event.target.value,
              )
            }
            aria-invalid={Boolean(errors.date)}
          />

          {errors.date && (
            <p className="text-sm text-destructive">
              {errors.date}
            </p>
          )}
        </div>
      </div>

      {/* TIME + SPECIALIST */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* TIME */}
        <div className="space-y-2">
          <Label htmlFor="booking-time">
            Preferred time *
          </Label>

          <Select
            value={values.time}
            onValueChange={(value) =>
              setField("time", value)
            }
          >
            <SelectTrigger
              id="booking-time"
              aria-invalid={Boolean(
                errors.time,
              )}
            >
              <SelectValue placeholder="Choose a time" />
            </SelectTrigger>

            <SelectContent>
              {TIME_OPTIONS.map((time) => (
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

        {/* SPECIALIST */}
        <div className="space-y-2">
          <Label htmlFor="booking-stylist">
            Preferred specialist *
          </Label>

          <Select
            value={values.stylist}
            onValueChange={(value) =>
              setField("stylist", value)
            }
          >
            <SelectTrigger
              id="booking-stylist"
              aria-invalid={Boolean(
                errors.stylist,
              )}
            >
              <SelectValue placeholder="Choose a specialist" />
            </SelectTrigger>

            <SelectContent>
              {STYLIST_OPTIONS.map(
                (stylist) => (
                  <SelectItem
                    key={stylist}
                    value={stylist}
                  >
                    {stylist}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          {errors.stylist && (
            <p className="text-sm text-destructive">
              {errors.stylist}
            </p>
          )}
        </div>
      </div>

      {/* OCCASION */}
      <div className="space-y-2">
        <Label htmlFor="booking-occasion">
          Occasion / requirement
        </Label>

        <Select
          value={values.occasion}
          onValueChange={(value) =>
            setField("occasion", value)
          }
        >
          <SelectTrigger
            id="booking-occasion"
          >
            <SelectValue placeholder="Select if applicable" />
          </SelectTrigger>

          <SelectContent>
            {OCCASION_OPTIONS.map(
              (occasion) => (
                <SelectItem
                  key={occasion}
                  value={occasion}
                >
                  {occasion}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {/* NOTES */}
      <div className="space-y-2">
        <Label htmlFor="booking-notes">
          Additional notes
        </Label>

        <Textarea
          id="booking-notes"
          value={values.notes}
          onChange={(event) =>
            setField(
              "notes",
              event.target.value,
            )
          }
          placeholder="Anything we should know?"
          maxLength={500}
          rows={4}
          aria-invalid={Boolean(errors.notes)}
        />

        {errors.notes && (
          <p className="text-sm text-destructive">
            {errors.notes}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Optional
        </p>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-gold transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"
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

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Your booking details will be sent to the
        salon for confirmation.
        {HAS_WHATSAPP
          ? " WhatsApp will open with your complete booking message."
          : ""}
        {" "}No payment is taken online.
      </p>
    </form>
  );
}