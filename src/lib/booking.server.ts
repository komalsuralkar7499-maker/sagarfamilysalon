import type { BookingRequest } from "./booking-schema";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type ResendConfig = {
  apiKey: string;
  from: string;
};

function resendConfig(): ResendConfig | null {
  const apiKey = process.env["RESEND_API_KEY"];

  if (!apiKey) {
    return null;
  }

  const from =
    process.env["RESEND_FROM_EMAIL"] ||
    "Sagar Family Salon <onboarding@resend.dev>";

  return {
    apiKey,
    from,
  };
}

async function sendEmail(
  apiKey: string,
  payload: Record<string, unknown>,
): Promise<boolean> {
  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      console.error(
        `Resend error [${response.status}]: ${await response.text()}`,
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Resend request failed:",
      error,
    );

    return false;
  }
}

/*
 * Extra fields are intentionally read from the validated
 * booking object when available. This keeps compatibility
 * with the existing BookingRequest type.
 */
function getExtraBookingFields(
  booking: BookingRequest,
): {
  time: string;
  stylist: string;
  occasion: string;
} {
  const extra =
    booking as BookingRequest & {
      time?: unknown;
      stylist?: unknown;
      occasion?: unknown;
    };

  return {
    time:
      typeof extra.time === "string"
        ? extra.time.trim()
        : "Not specified",

    stylist:
      typeof extra.stylist === "string"
        ? extra.stylist.trim()
        : "Any specialist",

    occasion:
      typeof extra.occasion === "string"
        ? extra.occasion.trim()
        : "Not specified",
  };
}

/**
 * Sends the booking notification to the salon.
 */
export async function sendBookingEmail(
  booking: BookingRequest,
): Promise<boolean> {
  const config = resendConfig();
  const salonEmail =
    process.env["SALON_BOOKING_EMAIL"];

  if (!config || !salonEmail) {
    return false;
  }

  const extra =
    getExtraBookingFields(booking);

  const rows: Array<[string, string]> = [
    ["Name", booking.name],
    ["Phone", booking.phone],
    ["Email", booking.email],
    ["Service", booking.service],
    [
      "Preferred date",
      booking.date || "Not specified",
    ],
    ["Preferred time", extra.time],
    ["Preferred specialist", extra.stylist],
    ["Occasion / requirement", extra.occasion],
    [
      "Additional notes",
      booking.notes?.trim() || "—",
    ],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto">
      <h2 style="color:#b8860b">
        New Appointment Request — Sagar Family Salon
      </h2>

      <p>
        A new customer has requested an appointment.
      </p>

      <table
        cellpadding="9"
        cellspacing="0"
        style="border-collapse:collapse;width:100%"
      >
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td
                  style="
                    border:1px solid #ddd;
                    font-weight:bold;
                    width:35%;
                  "
                >
                  ${escapeHtml(label)}
                </td>

                <td
                  style="
                    border:1px solid #ddd;
                  "
                >
                  ${escapeHtml(value)}
                </td>
              </tr>
            `,
          )
          .join("")}
      </table>

      <p style="margin-top:20px">
        Please contact the customer by phone or WhatsApp
        to confirm the availability of the requested slot.
      </p>
    </div>
  `;

  const text = [
    "NEW APPOINTMENT REQUEST — SAGAR FAMILY SALON",
    "",
    ...rows.map(
      ([label, value]) =>
        `${label}: ${value}`,
    ),
    "",
    "Please confirm the requested date and time with the customer.",
  ].join("\n");

  return sendEmail(config.apiKey, {
    from: config.from,
    to: [salonEmail],
    reply_to: booking.email,
    subject: `Appointment Request — ${booking.name} — ${booking.service}`,
    html,
    text,
  });
}

/**
 * Sends confirmation email to the customer.
 */
export async function sendConfirmationEmail(
  booking: BookingRequest,
): Promise<boolean> {
  const config = resendConfig();

  if (!config) {
    return false;
  }

  const extra =
    getExtraBookingFields(booking);

  const rows: Array<[string, string]> = [
    ["Service", booking.service],
    [
      "Preferred date",
      booking.date || "Not specified",
    ],
    ["Preferred time", extra.time],
    ["Preferred specialist", extra.stylist],
    ["Occasion / requirement", extra.occasion],
  ];

  const html = `
    <div
      style="
        font-family:Arial,sans-serif;
        max-width:560px;
        margin:0 auto;
        line-height:1.6;
      "
    >
      <h2 style="color:#b8860b">
        Sagar Family Salon
      </h2>

      <p>
        Hi ${escapeHtml(booking.name)},
      </p>

      <p>
        Thank you for your appointment request!
        We've received your details and will confirm
        your requested slot shortly by phone or WhatsApp.
      </p>

      <table
        cellpadding="9"
        cellspacing="0"
        style="border-collapse:collapse;width:100%;margin:18px 0"
      >
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td
                  style="
                    border:1px solid #ddd;
                    font-weight:bold;
                  "
                >
                  ${escapeHtml(label)}
                </td>

                <td
                  style="
                    border:1px solid #ddd;
                  "
                >
                  ${escapeHtml(value)}
                </td>
              </tr>
            `,
          )
          .join("")}
      </table>

      <p>
        <strong>
          Important:
        </strong>
        Your appointment is not confirmed until
        the salon confirms the availability.
      </p>

      <p>
        If anything changes, please call or WhatsApp us
        on <strong>+91 78419 50095</strong>.
      </p>

      <p
        style="
          color:#666;
          font-size:13px;
          margin-top:24px;
        "
      >
        Sagar Family Salon<br />
        Hakimi Hospital Building,<br />
        Hanuman Chowk, Near Maharashtra Bank,<br />
        Malkapur, Maharashtra – 443101<br /><br />
        Open Monday – Sunday, 10:00 AM – 8:00 PM
      </p>
    </div>
  `;

  const text = [
    `Hi ${booking.name},`,
    "",
    "Thank you for your appointment request!",
    "We've received your details and will confirm your requested slot shortly by phone or WhatsApp.",
    "",
    ...rows.map(
      ([label, value]) =>
        `${label}: ${value}`,
    ),
    "",
    "Important: Your appointment is not confirmed until the salon confirms the availability.",
    "",
    "If anything changes, please call or WhatsApp us on +91 78419 50095.",
    "",
    "Sagar Family Salon",
    "Hakimi Hospital Building, Hanuman Chowk, Near Maharashtra Bank,",
    "Malkapur, Maharashtra – 443101",
    "Open Monday – Sunday, 10:00 AM – 8:00 PM",
  ].join("\n");

  return sendEmail(config.apiKey, {
    from: config.from,
    to: [booking.email],
    subject:
      "Appointment Request Received — Sagar Family Salon",
    html,
    text,
  });
}