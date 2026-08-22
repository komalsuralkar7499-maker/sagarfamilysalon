import { createServerFn } from "@tanstack/react-start";
import { bookingSchema } from "./booking-schema";
import { sendBookingEmail } from "./booking.server";

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const emailed = await sendBookingEmail(data);
    return { emailed };
  });
