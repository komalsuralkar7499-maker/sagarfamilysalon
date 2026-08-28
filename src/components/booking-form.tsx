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
  booking: BookingFormValues,
): string {
  const lines: string[] = [
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
    `Preferred date: ${booking.date || "Not specified"}`,
    `Preferred time: ${booking.time || "Not specified"}`,
    `Preferred stylist: ${
      booking.stylist || "Any stylist"
    }`,
  ];

  if (booking.occasion.trim()) {
    lines.push(
      `Occasion / requirement: ${booking.occasion.trim()}`,
    );
  }

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

function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function BookingForm() {
  const [values, setValues] =
    useState<BookingFormValues>(EMPTY);

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [sending, setSending] =
    useState(false);

  function updateField(
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

    const parsed = bookingSchema.safeParse({
      name: values.name,
      phone: values.phone,
      email: values.email,
      service: values.service,
      date: values.date,
      notes: values.notes,
    });

    if (!parsed.success