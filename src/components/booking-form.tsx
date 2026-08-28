import { useState, type FormEvent } from "react";
import { CalendarCheck, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { HAS_WHATSAPP, SERVICE_CATEGORIES, whatsappLink } from "@/lib/salon";
import { bookingSchema, type BookingRequest } from "@/lib/booking-schema";
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
  b: BookingFormValues
): string {
  const lines = [
    "Hello Sagar Family Salon 👋",
    "",
    "I would like to book an appointment.",
    "",
    "👤 Customer Details",
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Email: ${b.email}`,
    "",
    "💇 Appointment Details",
    `Service: ${b.service}`,
    `Preferred date: ${b.date || "Not specified"}`,
    `Preferred time: ${b.time || "Not specified"}`,
    `Preferred stylist: ${b.stylist || "Any stylist"}`,
    `Occasion / requirement: ${
      b.occasion || "Not specified"
    }`,
  ];

  if (b.notes?.trim()) {
    lines.push(
      "",
      "📝 Additional Notes",
      b.notes.trim()
    );
  }

  lines.push(
    "",
    "Please confirm whether this date and time slot is available.",
    "Thank you!"
  );

  return lines.join("\n");
}

export function BookingForm() {
  const [values, setValues] =
    useState<BookingFormValues>(EMPTY);

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [sending, setSending] = useState(false);

  function set<K extends keyof BookingFormValues>(
    key: K,
    value: string
  ) {
    setValues((v) => ({
      ...v,
      [key]: value,
    }));

    setErrors((e) => ({
      ...e,
      [key]: undefined,
    }));
  }

  async function onSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const parsed =
      bookingSchema.safeParse({
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
      const message =
        buildWhatsAppMessage(values);

      window.open(
        whatsappLink(message),
        "_blank",
        "noopener,noreferrer"
      );
    }

    setSending(false);
    setValues(EMPTY);
    setErrors({});

    const confirmNote = confirmed
      ? " A confirmation email is on its way to your inbox."
      : "";

    if (emailed && HAS_WHATSAPP) {
      toast.success("Request sent!", {
        description:
          "Your complete booking details are ready in WhatsApp — just press Send." +
          confirmNote,
      });
    } else if (emailed) {
      toast.success("Request sent!", {
        description:
          "The salon has received your booking request by email." +
          confirmNote,
      });
    } else if (HAS_WHATSAPP) {
      toast.success("WhatsApp is ready!", {
        description:
          "Your complete booking details are prefilled. Just press Send.",
      });
    } else {
      toast.success("Details noted", {
        description:
          "Please contact the salon to confirm your appointment.",
      });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
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
            placeholder="+91 …"
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
          We'll send your appointment confirmation
          to this address.
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
            onValueChange={(v) =>
              set("service", v)
            }
          >
            <SelectTrigger
              id="booking-service"
              aria-invalid={!!errors.service}
            >
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>

            <SelectContent>
              {SERVICE_CATEGORIES.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.title}
                >
                  {cat.title}
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

        <div className="space-y-2">
          <Label htmlFor="booking-date">
            Preferred date *
          </Label>

          <Input
            id="booking-date"
            type="date"
            value={values.date}
            onChange={(e) =>
              set("date", e.target.value)
            }
            aria-invalid={!!errors.date}
          />

          {errors.date && (
            <p className="text-sm text-destructive">