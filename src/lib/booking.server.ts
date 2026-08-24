import type { BookingRequest } from "./booking-schema";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type ResendConfig = { apiKey: string; from: string };

function resendConfig(): ResendConfig | null {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) return null;
  // onboarding@resend.dev only delivers to the Resend account owner.
  // Set RESEND_FROM_EMAIL to an address on a domain verified in Resend
  // (e.g. "Sagar Family Salon <bookings@yourdomain.com>") so visitor
  // confirmation emails can be delivered to any recipient.
  const from =
    process.env["RESEND_FROM_EMAIL"] ||
    "Sagar Family Salon <onboarding@resend.dev>";
  return { apiKey, from };
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
      console.error(`Resend error [${res.status}]: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend request failed:", err);
    return false;
  }
}

/**
 * Sends the booking notification email to the salon via the Resend API.
 * Returns false when email is not configured (missing secrets) so the
 * caller can fall back to WhatsApp-only delivery.
 */
export async function sendBookingEmail(
  booking: BookingRequest,
): Promise<boolean> {
  const cfg = resendConfig();
  const to = process.env["SALON_BOOKING_EMAIL"];
  if (!cfg || !to) return false;

  const rows: Array<[string, string]> = [
    ["Name", booking.name],
    ["Phone", booking.phone],
    ["Email", booking.email],
    ["Service", booking.service],
    ["Preferred date", booking.date || "Not specified"],
    ["Notes", booking.notes?.trim() || "—"],
  ];

  const html = `
    <h2>New appointment request — Sagar Family Salon</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="border:1px solid #ddd;font-weight:bold">${label}</td><td style="border:1px solid #ddd">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
  `;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  return sendEmail(cfg.apiKey, {
    from: cfg.from,
    to: [to],
    reply_to: booking.email,
    subject: `Appointment request — ${booking.name} (${booking.service})`,
    html,
    text,
  });
}

/**
 * Sends a confirmation email to the visitor after their booking request
 * is submitted, including the chosen service and preferred date/time.
 * Returns false when email is not configured or the send fails so the
 * caller can adjust its messaging.
 */
export async function sendConfirmationEmail(
  booking: BookingRequest,
): Promise<boolean> {
  const cfg = resendConfig();
  if (!cfg) return false;

  const rows: Array<[string, string]> = [
    ["Service", booking.service],
    ["Preferred date", booking.date || "We'll find a time together"],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#b8860b">Sagar Family Salon</h2>
      <p>Hi ${escapeHtml(booking.name)},</p>
      <p>Thank you for your appointment request! We've received it and will
      confirm your slot shortly by phone or WhatsApp.</p>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin:16px 0">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="border:1px solid #ddd;font-weight:bold">${label}</td><td style="border:1px solid #ddd">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p>If anything changes, just call or WhatsApp us on
      <strong>+91 78419 50095</strong>.</p>
      <p style="color:#666;font-size:13px">
        Sagar Family Salon, Hakimi Hospital Building, Hanuman Chowk, Near
        Maharashtra Bank, Malkapur, Maharashtra – 443101<br />
        Open Monday – Sunday, 10:00 AM – 8:00 PM
      </p>
    </div>
  `;

  const text = [
    `Hi ${booking.name},`,
    "",
    "Thank you for your appointment request! We've received it and will confirm your slot shortly by phone or WhatsApp.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "If anything changes, call or WhatsApp us on +91 78419 50095.",
    "",
    "Sagar Family Salon, Hakimi Hospital Building, Hanuman Chowk, Near Maharashtra Bank, Malkapur, Maharashtra – 443101",
    "Open Monday – Sunday, 10:00 AM – 8:00 PM",
  ].join("\n");

  return sendEmail(cfg.apiKey, {
    from: cfg.from,
    to: [booking.email],
    subject: "We received your appointment request — Sagar Family Salon",
    html,
    text,
  });
}
