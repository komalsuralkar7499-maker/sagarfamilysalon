import type { BookingRequest } from "./booking-schema";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends the booking notification email via the Resend API.
 * Returns false when email is not configured (missing secrets) so the
 * caller can fall back to WhatsApp-only delivery.
 */
export async function sendBookingEmail(booking: BookingRequest): Promise<boolean> {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["SALON_BOOKING_EMAIL"];
  if (!apiKey || !to) return false;

  const rows: Array<[string, string]> = [
    ["Name", booking.name],
    ["Phone", booking.phone],
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

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Sagar Family Salon <bookings@resend.dev>",
        to: [to],
        subject: `Appointment request — ${booking.name} (${booking.service})`,
        html,
        text,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
