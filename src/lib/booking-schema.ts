import { z } from "zod";

// Shared client + server validation for the appointment booking form.
export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(100, "Name must be under 100 characters"),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20, "Phone number must be under 20 characters")
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
  service: z.string().trim().min(1, "Please choose a service").max(100),
  date: z.string().trim().max(40, "Preferred date must be under 40 characters"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be under 500 characters")
    .optional(),
});

export type BookingRequest = z.infer<typeof bookingSchema>;
