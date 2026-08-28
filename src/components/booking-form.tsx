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

type ExtraBookingDetails = {
  time: string;
  stylist: string;
  occasion: string;
};

type BookingFormValues =
  BookingRequest & ExtraBookingDetails;

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

const HAIR_KEYWORDS = [
  "hair",
  "haircut",
  "styling",
  "keratin",
  "straightening",
  "smoothening",
];

const BEAUTY_KEYWORDS = [
  "facial",
  "cleanup",
  "skin",
  "bleach",
  "d-tan",
  "makeup",
  "bridal",
];

function getStylists(service: string): string[] {
  const value = service.toLowerCase();

  if (
    HAIR_KEYWORDS.some((keyword) =>
      value.includes(keyword),
    )
  ) {
    return [
      "Hair Specialist",
      "Senior Hair Stylist",
      "Any Available Specialist",
    ];
  }

  if (
    BEAUTY_KEYWORDS.some((keyword) =>
      value.includes(keyword),
    )
  ) {
    return [
      "Beauty Specialist",
      "Skin & Beauty Specialist",
      "Any Available Specialist",
    ];
  }

  return [
    "Hair Specialist",
    "Beauty Specialist",
    "Any Available Specialist",
  ];
}

function buildWhatsAppMessage(
  booking: BookingFormValues,
): string {
  const lines = [
    "Hello Sagar Family Salon 👋",
    "",
    "I would like to book an appointment.",
    "",
    "👤 CUSTOMER DETAILS",
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Email: ${booking.email}`,
    "",
    "💇 APPOINTMENT DETAILS",
    `Service: ${booking.service}`,
    `Preferred date: ${
      booking.date || "Not specified"
    }`,
    `Preferred time: ${
      booking.time || "Not specified"
    }`,
    `Preferred specialist: ${
      booking.stylist || "Any Available Specialist"
    }`,
  ];

  if (booking.occasion.trim()) {
    lines.push(
      `Occasion / Requirement: ${booking.occasion.trim()}`,
    );
  }

  if (booking.notes.trim()) {
    lines.push(
      "",
      "📝 ADDITIONAL NOTES",
      booking.notes.trim(),
    );
  }

  lines.push(
    "",
    "Please confirm whether this date and time slot is available.",
    "",
    "Thank you! 🙏",
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

  function handleServiceChange(
    service: string,
  ) {
    const specialists =
      getStylists(service);

    setValues((current) => ({
      ...current,
      service,
      stylist:
        specialists[0] ??
        "Any Available Specialist",
    }));

    setErrors((current) => ({
      ...current,
      service: undefined,
      stylist: undefined,
    }));
  }

  async function onSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const parsed =
      bookingSchema.safeParse({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        service: values.service,
        date: values.date,
        notes: values.notes.trim(),
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

    const selectErrors: FieldErrors = {};

    if (!values.time) {
      selectErrors.time =
        "Please choose a preferred time.";
    }

    if (!values.stylist) {
      selectErrors.stylist =
        "Please choose a specialist.";
    }

    if (Object.keys(selectErrors).length > 0) {
      setErrors((current) => ({
        ...current,
        ...selectErrors,
      }));
      return;
    }

    setSending(true);

    let emailed = false;
    let confirmationEmailed = false;

    try {
      const result =
        await submitBooking({
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

    if (HAS_WHATSAPP) {
      const message =
        buildWhatsAppMessage(values);

      window.open(
        whatsappLink(message),
        "_blank",
        "noopener,noreferrer",
      );
    }

    setSending(false);
    setValues(EMPTY);
    setErrors({});

    const confirmationNote =
      confirmationEmailed
        ? " A confirmation email has also been sent."
        : "";

    if (emailed && HAS_WHATSAPP) {
      toast.success(
        "Booking request prepared!",
        {
          description:
            "Your complete booking details are ready in WhatsApp. Just press Send." +
            confirmationNote,
        },
      );
    } else if (emailed) {
      toast.success(
        "Booking request sent!",
        {
          description:
            "The salon has received your booking request by email." +
            confirmationNote,
        },
      );
    } else if (HAS_WHATSAPP) {
      toast.success(
        "WhatsApp is ready!",
        {
          description:
            "Your complete appointment details are pre-filled. Just press Send.",
        },
      );
    } else {
      toast.success(
        "Details noted!",
        {
          description:
            "Please contact the salon to confirm your appointment.",
        },
      );
    }
  }

  const stylistOptions =
    getStylists(values.service);

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
            aria-invalid={Boolean(
              errors.phone,
            )}
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
          aria-invalid={Boolean(
            errors.email,
          )}
        />

        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          We'll send your appointment
          confirmation to this email address.
        </p>
      </div>

      {/* SERVICE + DATE */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-service">
            Service *
          </Label>

          <Select
            value={values.service}
            onValueChange={
              handleServiceChange
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

        <div className="space-y-2">
          <Label htmlFor="booking-date">
            Preferred date *
          </Label>

          <Input
            id="booking-date"
            type="date"
            value={values.date}
            min={
              new Date()
                .toISOString()
                .split("T")[0]
            }
            onChange={(event) =>
              setField(
                "date",
                event.target.value,
              )
            }
            aria-invalid={Boolean(
              errors.date,
            )}
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
        <div className="space-y-2">
          <Label htmlFor="booking-time">
            Preferred time *
          </Label>

          <Select
            value={values.time}
            onValueChange={(value) => {
              setValues((current) => ({
                ...current,
                time: value,
              }));

              setErrors((current) => ({
                ...current,
                time: undefined,
              }));
            }}
          >
            <SelectTrigger
              id="booking-time"
              aria-invalid={
                Boolean(errors.time) &&
                !values.time
              }
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

          {!values.time &&
            errors.time && (
              <p className="text-sm text-destructive">
                {errors.time}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-stylist">
            Preferred specialist *
          </Label>

          <Select
            value={values.stylist}
            onValueChange={(value) => {
              setValues((current) => ({
                ...current,
                stylist: value,
              }));

              setErrors((current) => ({
                ...current,
                stylist: undefined,
              }));
            }}
          >
            <SelectTrigger
              id="booking-stylist"
              aria-invalid={
                Boolean(errors.stylist) &&
                !values.stylist
              }
            >
              <SelectValue placeholder="Choose a specialist" />
            </SelectTrigger>

            <SelectContent>
              {stylistOptions.map(
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

          {!values.stylist &&
            errors.stylist && (
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
            setField(
              "occasion",
              value,
            )
          }
        >
          <SelectTrigger
            id="booking-occasion"
          >
            <SelectValue placeholder="Select if applicable" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Regular visit">
              Regular visit
            </SelectItem>

            <SelectItem value="Party / Event">
              Party / Event
            </SelectItem>

            <SelectItem value="Wedding">
              Wedding
            </SelectItem>

            <SelectItem value="Bridal">
              Bridal
            </SelectItem>

            <SelectItem value="Pre-wedding">
              Pre-wedding
            </SelectItem>

            <SelectItem value="Special occasion">
              Special occasion
            </SelectItem>

            <SelectItem value="Not specified">
              Not specified
            </SelectItem>
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
          placeholder="Tell us anything else you'd like us to know..."
          rows={4}
          maxLength={1000}
        />

        <p className="text-xs text-muted-foreground">
          Optional
        </p>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold text-noir transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Preparing your booking...
          </>
        ) : HAS_WHATSAPP ? (
          <>
            <MessageCircle className="h-5 w-5" />
            Request Appointment
          </>
        ) : (
          <>
            <CalendarCheck className="h-5 w-5" />
            Request Appointment
          </>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        Your appointment is a request until the
        salon confirms the date and time.
      </p>
    </form>
  );
}