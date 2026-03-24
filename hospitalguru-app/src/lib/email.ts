import nodemailer from "nodemailer";
import { buildInquiryNotificationEmail } from "./email-templates";

// ─── Notification target ──────────────────────────────────────────────────────
const NOTIFY_EMAIL = "shezansiddique88@gmail.com";

// ─── Transporter (Gmail SMTP — uses App Password) ─────────────────────────────
// Setup: Google Account → Security → 2-Step Verification → App Passwords
// Set EMAIL_USER and EMAIL_APP_PASSWORD in .env

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

// ─── Send inquiry notification ────────────────────────────────────────────────
export async function sendInquiryNotification(data: {
  inquiryNumber: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  condition?: string | null;
  medicalSummary?: string | null;
  urgency?: string;
  source?: string;
  language?: string | null;
  chatContext?: string | null;
  createdAt?: Date;
}): Promise<{ sent: boolean; error?: string }> {

  const transporter = createTransporter();

  if (!transporter) {
    console.warn(
      "[Email] Skipped: EMAIL_USER or EMAIL_APP_PASSWORD not set in .env"
    );
    return { sent: false, error: "Email not configured" };
  }

  const { subject, html, text } = buildInquiryNotificationEmail({
    inquiryNumber: data.inquiryNumber,
    name: data.name,
    email: data.email,
    phone: data.phone,
    country: data.country,
    condition: data.condition,
    medicalSummary: data.medicalSummary,
    urgency: data.urgency ?? "routine",
    source: data.source ?? "web_form",
    language: data.language,
    chatContext: data.chatContext,
    createdAt: data.createdAt,
  });

  try {
    await transporter.sendMail({
      from: `"HospitalGuru Alerts" <${process.env.EMAIL_USER}>`,
      to: NOTIFY_EMAIL,
      subject,
      html,
      text,
    });

    console.log(`[Email] ✓ Notification sent for ${data.inquiryNumber}`);
    return { sent: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Email] ✗ Failed for ${data.inquiryNumber}:`, error);
    return { sent: false, error };
  }
}
