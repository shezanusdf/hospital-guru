import nodemailer from "nodemailer";
import { buildInquiryNotificationEmail, buildNetworkLeadEmail, buildContactRevealEmail } from "./email-templates";
import type { NetworkContact } from "@/data/network";

// ─── Notification target ──────────────────────────────────────────────────────
const NOTIFY_EMAIL = "shezansiddiqui7@gmail.com";

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

// ─── Send anonymized case sheet to hospital/doctor network ────────────────────
export async function sendNetworkLeadEmails(data: {
  inquiryNumber: string;
  leadToken: string;
  specialty: string;
  condition?: string | null;
  medicalSummary?: string | null;
  country?: string | null;
  urgency?: string;
  language?: string | null;
  contacts: NetworkContact[];
}): Promise<{ sent: number; failed: number }> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[Network Email] Skipped: email not configured");
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const contact of data.contacts) {
    const { subject, html, text } = buildNetworkLeadEmail({ ...data, contactName: contact.name, contactEmail: contact.email });
    try {
      await transporter.sendMail({
        from: `"HospitalGuru Leads" <${process.env.EMAIL_USER}>`,
        to: contact.email,
        replyTo: NOTIFY_EMAIL,
        subject,
        html,
        text,
      });
      console.log(`[Network Email] ✓ Sent ${data.inquiryNumber} to ${contact.email}`);
      sent++;
    } catch (err) {
      console.error(`[Network Email] ✗ Failed to ${contact.email}:`, err);
      failed++;
    }
  }

  return { sent, failed };
}

// ─── Send full patient contact details after hospital accepts ─────────────────
export async function sendContactReveal(data: {
  inquiryNumber: string;
  toEmail: string;
  toName: string;
  patientName?: string | null;
  patientEmail?: string | null;
  patientPhone?: string | null;
  patientCountry?: string | null;
  condition?: string | null;
  medicalSummary?: string | null;
}): Promise<{ sent: boolean; error?: string }> {
  const transporter = createTransporter();
  if (!transporter) return { sent: false, error: "Email not configured" };

  const { subject, html, text } = buildContactRevealEmail(data);
  try {
    await transporter.sendMail({
      from: `"HospitalGuru" <${process.env.EMAIL_USER}>`,
      to: data.toEmail,
      replyTo: NOTIFY_EMAIL,
      subject,
      html,
      text,
    });
    console.log(`[Contact Reveal] ✓ Sent to ${data.toEmail} for ${data.inquiryNumber}`);
    return { sent: true };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Contact Reveal] ✗ Failed:`, error);
    return { sent: false, error };
  }
}
