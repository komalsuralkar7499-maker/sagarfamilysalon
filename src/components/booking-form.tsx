import { useState, type FormEvent } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  HAS_WHATSAPP,
  SERVICE_PRICES,
  whatsappLink,
} from "@/lib/salon";

import { bookingSchema } from "@/lib/booking-schema";

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

type BookingFormValues = {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  stylist: string;
  occasion: string;
  notes: string;
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
  time: "",
  stylist: "",
  occasion: "",
  notes: "",
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

/**
 * Build one flat list of all available salon services.
 *
 * The service names and prices come from SERVICE_PRICES
 * so the WhatsApp message always uses the same pricing
 * source as the website.
 */
const SERVICE_OPTIONS = SERVICE_PRICES.flatMap(
  (category) =>
    category.services.map((service) => ({
      category: category.category,
      name: service.name,
      price: service.price,
    })),
);

function formatDate(date: string): string {
  if (!date) return "Not specified";

  const parts = date.split("-");

  if (parts.length !== 3) return date;

  const [year, month, day] = parts;

  if (
    !year ||
    !month ||
    !day ||
    year.length !== 4 ||
    month.length !== 2 ||
    day.length !== 2
  ) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

/**
 * Find the exact price of the selected service.
 *
 * Returns a safe fallback if the service cannot be found.
 */
function getServicePrice(
  serviceName: string,
): number | null {
  const normalized = serviceName
    .trim()
    .toLowerCase();

  if (!normalized) return null;

  const service = SERVICE_OPTIONS.find(
    (item) =>
      item.name.trim().toLowerCase() ===
      normalized,
  );

  return service?.price ?? null;
}

function formatPrice(
  serviceName: string,
): string {
  const price = getServicePrice(serviceName);

  if (price === null) {
    return "Price to be confirmed";
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

function buildWhatsAppMessage(
  booking: BookingFormValues,
): string {
  const serviceName = booking.service.trim();

  const lines = [
    "Hello Sagar Family Salon 👋",
    "",
    "I would like to book an appointment.",
    "",
    "👤 CUSTOMER DETAILS",
    `Name: ${booking.name.trim()}`,
    `Phone: ${booking.phone.trim()}`,
    `Email: ${booking.email.trim()}`,
    "",
    "💇 APPOINTMENT DETAILS",
    `Service: ${serviceName}`,
    `Price: ${formatPrice(serviceName)}`,
    `Preferred date: ${formatDate(booking.date)}`,
    `Preferred time: ${
      booking.time.trim() || "Not specified"
    }`,
    `Preferred specialist: ${
      booking.stylist.trim() || "Any Specialist"
    }`,
    `Occasion / requirement: ${
      booking.occasion.trim() || "Not specified"
    }`,
  ];

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

  const [sending, setSending] = useState(false);

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

  function onSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (sending) return;

    if (!HAS_WHATSAPP) {
      toast.error(
        "WhatsApp booking is unavailable.",
        {
          description:
            "Please contact Sagar Family Salon by phone.",
        },
      );

      return;
    }

    const dataForValidation = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      service: values.service.trim(),
      date: values.date.trim(),
      time: values.time.trim(),
      stylist:
        values.stylist.trim() ||
        "Any Specialist",
      notes: values.notes.trim(),
    };

    const parsed =
      bookingSchema.safeParse(
        dataForValidation,
      );

    const nextErrors: FieldErrors = {};

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field =
          issue.path[0] as keyof BookingFormValues;

        if (
          field &&
          !nextErrors[field]
        ) {
          nextErrors[field] =
            issue.message;
        }
      }
    }

    if (!values.time.trim()) {
      nextErrors.time =
        "Please choose a preferred time";
    }

    /**
     * Extra protection:
     * make sure the selected service exists
     * in our official salon price list.
     */
    const selectedService =
      SERVICE_OPTIONS.find(
        (service) =>
          service.name ===
          values.service.trim(),
      );

    if (!selectedService) {
      nextErrors.service =
        "Please choose a valid service";
    }

    if (
      Object.keys(nextErrors).length > 0
    ) {
      setErrors(nextErrors);

      toast.error(
        "Please complete the required fields.",
        {
          description:
            "Name, phone, email, service, date and preferred time are required.",
        },
      );

      return;
    }

    setSending(true);

    try {
      const message =
        buildWhatsAppMessage(values);

      const url = whatsappLink(message);

      /**
       * whatsappLink() already URL-encodes
       * the message using encodeURIComponent().
       *
       * We do not inject raw HTML or execute
       * user-provided content.
       */
      window.location.href = url;

      toast.success(
        "Opening WhatsApp…",
        {
          description:
            "Your appointment details