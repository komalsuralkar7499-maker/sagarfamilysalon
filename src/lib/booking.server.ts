import type { BookingRequest } from "./booking-schema";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type ResendConfig = {
  apiKey: string;
  from: string;
};

function resendConfig(): ResendConfig | null {
  const apiKey = process.env["RESEND_API_KEY"];

  if (!apiKey) return null;

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
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(
        `Resend error [${res.status}]: ${await res.text()}`,
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error("Resend request failed:", err);
    return false;
  }
}

export async function sendBookingEmail(
  booking: BookingRequest,
): Promise<boolean> {
  const cfg = resendConfig();
  const to = process.env["SALON_BOOKING_EMAIL"];

  if (!cfg || !to) return false;

  const rows: Array<[string, string]> = [
    ["Customer Name", booking.name],
    ["Phone Number", booking.phone],
    ["Email Address", booking.email],
    ["Service", booking.service],
    ["Preferred Date", booking.date || "Not specified"],
    ["Preferred Time", booking.time || "Not specified"],
    ["Preferred Stylist", booking.stylist || "Any stylist"],
    ["Occasion / Requirement", booking.occasion || "Not specified"],
    ["Additional Notes", booking.notes?.trim() || "—"],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto">
      <div style="background:#111;color:white;padding:24px;border-radius:12px 12px 0 0">
        <h2 style="margin:0;color:#d4af37">
          New Appointment Request
        </h2>
        <p style="margin:8px 0 0;color:#ddd">
          Sagar Family Salon
        </p>
      </div>

      <div style="padding:20px;background:#fafafa">
        <table
          cellpadding="10"
          cellspacing="0"
          width="100%"
          style="border-collapse:collapse;background:white"
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

                  <td style="border:1px solid #ddd">
                    ${escapeHtml(value)}
                  </td>
                </tr>
              `,
            )
            .join("")}
        </table>

        <div
          style="
            margin-top:20px;
            padding:16px;
            background:#fff8df;
            border:1px solid #ead48b;
            border-radius:8px;
          "
        >
          <strong>Action Required</strong>

          <p style="margin:8px 0 0">
            Please check the salon schedule and confirm whether
            the requested date and time are available.
          </p>

          <p style="margin:8px 0 0">
            You can reply directly to this email or contact the
            customer by phone/WhatsApp.
          </p>
        </div>
      </div>
    </div>
  `;

  const text = [
    "NEW APPOINTMENT REQUEST — SAGAR FAMILY SALON",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "ACTION REQUIRED:",
    "Please check the salon schedule and confirm whether the requested date and time are available.",
  ].join("\n");

  return sendEmail(cfg.apiKey, {
    from: cfg.from,
    to: [to],
    reply_to: booking.email,
    subject: `New Appointment — ${booking.name} — ${booking.date} ${booking.time || ""}`,
    html,
    text,
  });
}

export async function sendConfirmationEmail(
  booking: BookingRequest,
): Promise<boolean> {
  const cfg = resendConfig();

  if (!cfg) return false;

  const rows: Array<[string, string]> = [
    ["Service", booking.service],
    ["Preferred date", booking.date || "Not specified"],
    ["Preferred time", booking.time || "Not specified"],
    ["Preferred stylist", booking.stylist || "Any stylist"],
    ["Occasion / Requirement", booking.occasion || "Not specified"],
  ];

  if (booking.notes?.trim()) {
    rows.push(["Additional Notes", booking.notes.trim()]);
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">

      <h2 style="color:#b8860b">
        Sagar Family Salon
      </h2>

      <h3>
        Appointment Request Received
      </h3>

      <p>
        Hi ${escapeHtml(booking.name)},
      </p>

      <p>
        Thank you for choosing Sagar Family Salon.
        We've received your appointment request.
      </p>

      <p>
        Our team will check the requested slot and
        confirm your appointment shortly by phone or WhatsApp.
      </p>

      <table
        cellpadding="8"
        cellspacing="0"
        style="border-collapse:collapse;margin:18px 0;width:100%"
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

                <td style="border:1px solid #ddd">
                  ${escapeHtml(value)}
                </td>
              </tr>
            `,
          )
          .join("")}
      </table>

      <p>
        If you need to change anything, please contact us.
      </p>

      <p>
        <strong>Phone / WhatsApp:</strong>
        +91 78419 50095
      </p>

      <p style="color:#666;font-size:13px">
        Sagar Family Salon<br />
        Hakimi Hospital Building,<br />
        Hanuman Chowk, Near Maharashtra Bank,<br />
        Malkapur, Maharashtra – 443101<br />
        Open Monday – Sunday, 10:00 AM – 8:00 PM
      </p>

    </div>
  `;

  const text = [
    `Hi ${booking.name},`,
    "",
    "Thank you for choosing Sagar Family Salon.",
    "We've received your appointment request.",
    "",
    "Our team will check the requested slot and confirm your appointment shortly.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Phone / WhatsApp: +91 78419 50095",
    "",
    "Sagar Family Salon",
    "Hakimi Hospital Building, Hanuman Chowk, Near Maharashtra Bank,",
    "Malkapur, Maharashtra – 443101",
    "Open Monday – Sunday, 10:00 AM – 8:00 PM",
  ].join("\n");

  return sendEmail(cfg.apiKey, {
    from: cfg.from,
    to: [booking.email],
    subject:
      "Appointment Request Received — Sagar Family Salon",
    html,
    text,
  });
}