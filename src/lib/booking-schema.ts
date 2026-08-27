import { z } from "zod";

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

  email: z
    .string()
    .trim()
    .max(254, "Email must be under 254 characters")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address",
    ),

  service: z
    .string()
    .trim()
    .min(1, "Please choose a service")
    .max(100),

  date: z
    .string()
    .trim()
    .min(1, "Please choose a date")
    .max(40),

  time: z
    .string()
    .trim()
    .min(1, "Please choose a preferred time")
    .max(30),

  stylist: z
    .string()
    .trim()
    .min(1, "Please choose a stylist")
    .max(100),

  notes: z
    .string()
    .trim()
    .max(500, "Notes must be under 500 characters")
    .optional(),
});

export type BookingRequest = z.infer<typeof bookingSchema>;