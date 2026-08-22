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

const EMPTY: BookingRequest = {
  name: "",
  phone: "",
  service: "",
  date: "",
  notes: "",
};

type FieldErrors = Partial<Record<keyof BookingRequest, string>>;

function buildWhatsAppMessage(b: BookingRequest): string {
  const lines = [
    "Hello Sagar Family Salon, I would like to book an appointment.",
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Service: ${b.service}`,
  ];
  if (b.date) lines.push(`Preferred date: ${b.date}`);
  if (b.notes?.trim()) lines.push(`Notes: ${b.notes.trim()}`);
  return lines.join("\n");
}

export function BookingForm() {
  const [values, setValues] = useState<BookingRequest>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);

  function set<K extends keyof BookingRequest>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof BookingRequest;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSending(true);
    let emailed = false;
    try {
      const result = await submitBooking({ data: parsed.data });
      emailed = result.emailed;
    } catch {
      emailed = false;
    }

    if (HAS_WHATSAPP) {
      window.open(whatsappLink(buildWhatsAppMessage(parsed.data)), "_blank", "noopener,noreferrer");
    }

    setSending(false);
    setValues(EMPTY);
    setErrors({});

    if (emailed && HAS_WHATSAPP) {
      toast.success("Request sent!", {
        description: "We've emailed the salon and opened WhatsApp with your details — just press send.",
      });
    } else if (emailed) {
      toast.success("Request sent!", {
        description: "The salon has received your booking request by email.",
      });
    } else if (HAS_WHATSAPP) {
      toast.success("Opening WhatsApp…", {
        description: "Your booking details are prefilled — just press send to confirm with the salon.",
      });
    } else {
      toast.success("Details noted", {
        description: "Please share these details with the salon by phone or in person to confirm.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-name">Your name *</Label>
          <Input
            id="booking-name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Full name"
            maxLength={100}
            autoComplete="name"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-phone">Phone number *</Label>
          <Input
            id="booking-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91 …"
            maxLength={20}
            autoComplete="tel"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-service">Service *</Label>
          <Select value={values.service} onValueChange={(v) => set("service", v)}>
            <SelectTrigger id="booking-service" aria-invalid={!!errors.service}>
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.title}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-date">Preferred date</Label>
          <Input
            id="booking-date"
            type="date"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            aria-invalid={!!errors.date}
          />
          {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-notes">Notes (optional)</Label>
        <Textarea
          id="booking-notes"
          value={values.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Anything we should know — occasion, preferred stylist, timing…"
          maxLength={500}
          rows={4}
          aria-invalid={!!errors.notes}
        />
        {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {sending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : HAS_WHATSAPP ? (
          <MessageCircle className="h-5 w-5" />
        ) : (
          <CalendarCheck className="h-5 w-5" />
        )}
        {sending ? "Sending…" : "Request appointment"}
      </button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Submitting sends your request to the salon by email
        {HAS_WHATSAPP ? " and opens WhatsApp with a prefilled message" : ""}. No
        payment is taken online.
      </p>
    </form>
  );
}
