import { createServerFn } from "@tanstack/react-start";
import { bookingSchema } from "./booking-schema";
import { sendBookingEmail, sendConfirmationEmail } from "./booking.server";

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const [emailed, confirmationEmailed] = await Promise.all([
      sendBookingEmail(data),
      sendConfirmationEmail(data),
    ]);
    return { emailed, confirmationEmailed };
  });
