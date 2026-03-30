type InquiryEmailData = {
  treatmentName?: string | null;
  inquiryNumber: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  condition?: string | null;
  medicalSummary?: string | null;
  urgency: string;
  source: string;
  language?: string | null;
  chatContext?: string | null;
  createdAt?: Date;
};

const urgencyConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  emergency: { label: "🚨 EMERGENCY", color: "#991b1b", bg: "#fee2e2", border: "#fca5a5" },
  urgent:    { label: "⚡ URGENT",    color: "#92400e", bg: "#fef3c7", border: "#fcd34d" },
  routine:   { label: "✅ ROUTINE",   color: "#065f46", bg: "#d1fae5", border: "#6ee7b7" },
};

const sourceConfig: Record<string, { label: string; color: string; bg: string }> = {
  chatbot:   { label: "🤖 AI Chatbot",   color: "#1d4ed8", bg: "#eff6ff" },
  web_form:  { label: "📝 Web Form",     color: "#6d28d9", bg: "#f5f3ff" },
  whatsapp:  { label: "💬 WhatsApp",     color: "#15803d", bg: "#f0fdf4" },
  phone:     { label: "📞 Phone",        color: "#9a3412", bg: "#fff7ed" },
};

const countryFlags: Record<string, string> = {
  russia: "🇷🇺", kazakhstan: "🇰🇿", ukraine: "🇺🇦", belarus: "🇧🇾",
  uzbekistan: "🇺🇿", azerbaijan: "🇦🇿", armenia: "🇦🇲", georgia: "🇬🇪",
  kyrgyzstan: "🇰🇬", tajikistan: "🇹🇯", turkmenistan: "🇹🇲", moldova: "🇲🇩",
};

function getCountryFlag(country?: string | null): string {
  if (!country) return "🌍";
  const key = country.toLowerCase().replace(/\s+🇷🇺|🇰🇿|🇺🇦.*/g, "").trim();
  return countryFlags[key] ?? "🌍";
}

function parseChatContext(raw?: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export function buildInquiryNotificationEmail(data: InquiryEmailData): { subject: string; html: string; text: string } {
  const urgency = urgencyConfig[data.urgency] ?? urgencyConfig.routine;
  const source = sourceConfig[data.source] ?? sourceConfig.web_form;
  const chatCtx = parseChatContext(data.chatContext);
  const flag = getCountryFlag(data.country);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const isRussian = data.language === "ru";

  const timeStr = data.createdAt
    ? new Date(data.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false })
    : new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });

  const subject = data.urgency === "emergency"
    ? `🚨 EMERGENCY INQUIRY ${data.inquiryNumber} — ${data.name ?? "Unknown"} (${data.country ?? "CIS"})`
    : data.urgency === "urgent"
    ? `⚡ Urgent: New Lead ${data.inquiryNumber} — ${data.condition ?? "Medical Treatment"}`
    : `🏥 New Inquiry ${data.inquiryNumber} — ${data.name ?? "Patient"} from ${data.country ?? "CIS"}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1d4ed8,#0891b2);border-radius:12px 12px 0 0;padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:22px;font-weight:900;color:#fff;">Hospital</span><span style="font-size:22px;font-weight:900;color:#5eead4;">Guru</span>
                  <div style="color:#bfdbfe;font-size:11px;margin-top:2px;letter-spacing:1px;text-transform:uppercase;">Medical Tourism Platform</div>
                </td>
                <td align="right">
                  <span style="background:rgba(255,255,255,0.15);color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.25);">
                    NEW INQUIRY
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Urgency + Source bar -->
        <tr>
          <td style="padding:0 32px;background:#fff;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #e5e7eb;padding:14px 0;">
              <tr>
                <td>
                  <span style="background:${urgency.bg};color:${urgency.color};border:1px solid ${urgency.border};font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px;">
                    ${urgency.label}
                  </span>
                </td>
                <td align="center">
                  <span style="background:${source.bg};color:${source.color};font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;">
                    ${source.label}
                  </span>
                </td>
                <td align="right" style="color:#6b7280;font-size:11px;">
                  ${timeStr} IST
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Inquiry Number -->
        <tr>
          <td style="background:#eff6ff;padding:12px 32px;border-bottom:1px solid #dbeafe;">
            <span style="color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Inquiry Reference</span>
            <span style="color:#1d4ed8;font-size:16px;font-weight:800;margin-left:12px;">${data.inquiryNumber}</span>
          </td>
        </tr>

        <!-- Patient Details -->
        <tr>
          <td style="background:#fff;padding:24px 32px;">
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:16px;">Patient Information</div>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              ${data.name ? `
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;width:130px;">Name</td>
                <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#111827;">${data.name}</td>
              </tr>` : ""}
              ${data.email ? `
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Email</td>
                <td style="padding:10px 16px;font-size:14px;color:#1d4ed8;"><a href="mailto:${data.email}" style="color:#1d4ed8;text-decoration:none;">${data.email}</a></td>
              </tr>` : ""}
              ${data.phone ? `
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Phone / WhatsApp</td>
                <td style="padding:10px 16px;font-size:14px;color:#111827;"><a href="https://wa.me/${data.phone?.replace(/[^0-9]/g, "")}" style="color:#15803d;text-decoration:none;">📱 ${data.phone}</a></td>
              </tr>` : ""}
              <tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Country</td>
                <td style="padding:10px 16px;font-size:14px;color:#111827;">${flag} ${data.country ?? "Not specified"}</td>
              </tr>
              ${data.language ? `
              <tr>
                <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Language</td>
                <td style="padding:10px 16px;font-size:14px;color:#111827;">${isRussian ? "🇷🇺 Russian" : "🇬🇧 English"}</td>
              </tr>` : ""}
            </table>
          </td>
        </tr>

        <!-- Medical Condition -->
        <tr>
          <td style="background:#fff;padding:0 32px 24px;">
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:12px;">Medical Condition</div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;">
              <div style="font-size:16px;font-weight:700;color:#14532d;margin-bottom:6px;">
                🏥 ${data.condition ?? data.treatmentName ?? "Not specified"}
              </div>
              ${data.medicalSummary && data.medicalSummary !== data.condition ? `
              <div style="font-size:13px;color:#166534;line-height:1.6;">
                ${data.medicalSummary}
              </div>` : ""}
            </div>
          </td>
        </tr>

        ${chatCtx && Object.keys(chatCtx).length > 1 ? `
        <!-- Chat Context -->
        <tr>
          <td style="background:#fff;padding:0 32px 24px;">
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:12px;">AI Chat Summary</div>
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;font-size:12px;color:#1e40af;font-family:monospace;white-space:pre-wrap;line-height:1.6;">
${Object.entries(chatCtx)
  .filter(([k]) => !["leadCaptured"].includes(k))
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}
            </div>
          </td>
        </tr>` : ""}

        <!-- Action Buttons -->
        <tr>
          <td style="background:#fff;padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:8px;">
                  <a href="${appUrl}/admin"
                     style="display:block;background:#1d4ed8;color:#fff;text-align:center;padding:12px 0;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
                    📊 Open Admin Dashboard
                  </a>
                </td>
                ${data.email ? `
                <td style="padding-left:8px;">
                  <a href="mailto:${data.email}?subject=Re: Your HospitalGuru Inquiry ${data.inquiryNumber}"
                     style="display:block;background:#f9fafb;color:#374151;border:1px solid #d1d5db;text-align:center;padding:12px 0;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
                    ✉️ Reply to Patient
                  </a>
                </td>` : ""}
                ${data.phone ? `
                <td style="padding-left:8px;">
                  <a href="https://wa.me/${data.phone?.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(data.name ?? "there")}%2C%20this%20is%20HospitalGuru%20team%20regarding%20your%20inquiry%20${data.inquiryNumber}"
                     style="display:block;background:#15803d;color:#fff;text-align:center;padding:12px 0;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
                    💬 WhatsApp Patient
                  </a>
                </td>` : ""}
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1e293b;border-radius:0 0 12px 12px;padding:20px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#94a3b8;font-size:11px;">
                  HospitalGuru.com — Medical Tourism Platform
                </td>
                <td align="right" style="color:#64748b;font-size:11px;">
                  Ref: ${data.inquiryNumber}
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
NEW INQUIRY — ${data.inquiryNumber}
${"=".repeat(50)}
Urgency: ${urgency.label}
Source: ${source.label}
Time: ${timeStr} IST

PATIENT:
  Name:    ${data.name ?? "Not provided"}
  Email:   ${data.email ?? "Not provided"}
  Phone:   ${data.phone ?? "Not provided"}
  Country: ${flag} ${data.country ?? "Not specified"}
  Language: ${isRussian ? "Russian" : "English"}

CONDITION:
  ${data.condition ?? "Not specified"}
  ${data.medicalSummary ?? ""}

Admin: ${appUrl}/admin
`.trim();

  return { subject, html, text };
}

export type { InquiryEmailData };

// ─── Anonymized case sheet email sent to hospital/doctor network ──────────────
export function buildNetworkLeadEmail(data: {
  inquiryNumber: string;
  leadToken: string;
  specialty: string;
  condition?: string | null;
  medicalSummary?: string | null;
  country?: string | null;
  urgency?: string;
  language?: string | null;
  contactName: string;
  contactEmail?: string;
}): { subject: string; html: string; text: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hospitalguru.com";
  const encodedEmail = Buffer.from(data.contactEmail ?? "").toString("base64url");
  const acceptUrl = `${appUrl}/api/lead-accept?token=${data.leadToken}&for=${encodedEmail}`;
  const urgency = urgencyConfig[data.urgency ?? "routine"] ?? urgencyConfig.routine;
  const flag = getCountryFlag(data.country);
  const specialtyLabel = data.specialty.charAt(0).toUpperCase() + data.specialty.slice(1);

  const subject = `🏥 New ${specialtyLabel} Lead from HospitalGuru — Ref ${data.inquiryNumber}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#0f766e,#0891b2);border-radius:12px 12px 0 0;padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <span style="font-size:22px;font-weight:900;color:#fff;">Hospital</span><span style="font-size:22px;font-weight:900;color:#99f6e4;">Guru</span>
              <div style="color:#ccfbf1;font-size:11px;margin-top:2px;letter-spacing:1px;text-transform:uppercase;">New Patient Lead</div>
            </td>
            <td align="right">
              <span style="background:rgba(255,255,255,0.15);color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px;border:1px solid rgba(255,255,255,0.25);">
                ${specialtyLabel.toUpperCase()}
              </span>
            </td>
          </tr></table>
        </td>
      </tr>

      <!-- Disclaimer banner -->
      <tr>
        <td style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px 32px;">
          <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">
            ⚠️ By accepting this lead, you agree to offer the patient the <strong>HospitalGuru Special Discount</strong> — a minimum <strong>10% discount</strong> on your published treatment rates.
          </p>
        </td>
      </tr>

      <!-- Urgency bar -->
      <tr>
        <td style="background:#fff;padding:14px 32px;border-bottom:1px solid #e5e7eb;">
          <span style="background:${urgency.bg};color:${urgency.color};border:1px solid ${urgency.border};font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px;">
            ${urgency.label}
          </span>
          <span style="margin-left:12px;color:#6b7280;font-size:12px;">Ref: <strong>${data.inquiryNumber}</strong></span>
        </td>
      </tr>

      <!-- Anonymized case sheet -->
      <tr>
        <td style="background:#fff;padding:24px 32px;">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:16px;">Anonymized Patient Case</div>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;width:140px;">Specialty</td>
              <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#0f766e;">${specialtyLabel}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Condition / Treatment</td>
              <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#111827;">${data.condition ?? "Not specified"}</td>
            </tr>
            ${data.medicalSummary ? `
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Patient Summary</td>
              <td style="padding:10px 16px;font-size:13px;color:#374151;line-height:1.6;">${data.medicalSummary}</td>
            </tr>` : ""}
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Country</td>
              <td style="padding:10px 16px;font-size:14px;color:#111827;">${flag} ${data.country ?? "CIS Region"}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Language</td>
              <td style="padding:10px 16px;font-size:14px;color:#111827;">${data.language === "ru" ? "🇷🇺 Russian" : "🇬🇧 English"}</td>
            </tr>
          </table>

          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin-top:16px;">
            <p style="margin:0;font-size:12px;color:#166534;">
              🔒 <strong>Contact details are hidden.</strong> Patient name, phone, and email will be shared with you automatically once you accept this lead.
            </p>
          </div>
        </td>
      </tr>

      <!-- Accept button -->
      <tr>
        <td style="background:#fff;padding:0 32px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:8px;">
              <a href="${acceptUrl}"
                 style="display:block;background:#0f766e;color:#fff;text-align:center;padding:16px 0;border-radius:10px;font-size:16px;font-weight:800;text-decoration:none;letter-spacing:0.3px;">
                ✅ Accept This Lead
              </a>
            </td>
          </tr></table>
          <p style="margin:12px 0 0;font-size:11px;color:#9ca3af;text-align:center;">
            By clicking "Accept This Lead" you confirm you will offer the HospitalGuru Special 10% discount to this patient.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#1e293b;border-radius:0 0 12px 12px;padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="color:#94a3b8;font-size:11px;">HospitalGuru.com — Medical Tourism Platform</td>
            <td align="right" style="color:#64748b;font-size:11px;">Ref: ${data.inquiryNumber}</td>
          </tr></table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = `
NEW PATIENT LEAD — ${data.inquiryNumber}
${"=".repeat(50)}
Specialty: ${specialtyLabel}
Condition: ${data.condition ?? "Not specified"}
${data.medicalSummary ? `Summary: ${data.medicalSummary}` : ""}
Country: ${data.country ?? "CIS Region"}
Urgency: ${urgency.label}

DISCLAIMER: By accepting this lead you agree to offer the patient a minimum 10% HospitalGuru Special Discount.

Contact details are hidden. They will be sent to you automatically once you accept.

ACCEPT LEAD: ${acceptUrl}
`.trim();

  return { subject, html, text };
}

// ─── Contact reveal email sent after hospital accepts ─────────────────────────
export function buildContactRevealEmail(data: {
  inquiryNumber: string;
  toName: string;
  patientName?: string | null;
  patientEmail?: string | null;
  patientPhone?: string | null;
  patientCountry?: string | null;
  condition?: string | null;
  medicalSummary?: string | null;
}): { subject: string; html: string; text: string } {
  const flag = getCountryFlag(data.patientCountry);
  const subject = `✅ Lead Accepted — Patient Contact Details for ${data.inquiryNumber}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#15803d,#0f766e);border-radius:12px 12px 0 0;padding:28px 32px;">
          <span style="font-size:22px;font-weight:900;color:#fff;">Hospital</span><span style="font-size:22px;font-weight:900;color:#99f6e4;">Guru</span>
          <div style="color:#bbf7d0;font-size:13px;margin-top:6px;font-weight:600;">✅ You accepted the lead — here are the patient's contact details.</div>
        </td>
      </tr>

      <!-- Reminder -->
      <tr>
        <td style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px 32px;">
          <p style="margin:0;font-size:13px;color:#92400e;font-weight:600;">
            Reminder: You have committed to offering this patient the <strong>HospitalGuru Special — minimum 10% discount</strong> on your published treatment rates.
          </p>
        </td>
      </tr>

      <!-- Patient contact details -->
      <tr>
        <td style="background:#fff;padding:24px 32px;">
          <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:16px;">Patient Contact Details</div>

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            ${data.patientName ? `
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;width:140px;">Name</td>
              <td style="padding:12px 16px;font-size:15px;font-weight:700;color:#111827;">${data.patientName}</td>
            </tr>` : ""}
            ${data.patientPhone ? `
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Phone / WhatsApp</td>
              <td style="padding:12px 16px;font-size:15px;font-weight:700;">
                <a href="https://wa.me/${data.patientPhone.replace(/[^0-9]/g, "")}" style="color:#15803d;text-decoration:none;">📱 ${data.patientPhone}</a>
              </td>
            </tr>` : ""}
            ${data.patientEmail ? `
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Email</td>
              <td style="padding:12px 16px;font-size:14px;">
                <a href="mailto:${data.patientEmail}" style="color:#1d4ed8;text-decoration:none;">${data.patientEmail}</a>
              </td>
            </tr>` : ""}
            <tr style="border-bottom:1px solid #f3f4f6;">
              <td style="padding:12px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Country</td>
              <td style="padding:12px 16px;font-size:14px;color:#111827;">${flag} ${data.patientCountry ?? "CIS Region"}</td>
            </tr>
            <tr>
              <td style="padding:12px 16px;background:#f9fafb;font-size:12px;font-weight:600;color:#6b7280;">Condition</td>
              <td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0f766e;">${data.condition ?? "Not specified"}</td>
            </tr>
          </table>

          ${data.medicalSummary ? `
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;margin-top:16px;">
            <div style="font-size:12px;font-weight:600;color:#6b7280;margin-bottom:6px;">Patient Summary</div>
            <div style="font-size:13px;color:#166534;line-height:1.6;">${data.medicalSummary}</div>
          </div>` : ""}
        </td>
      </tr>

      <!-- Next steps -->
      <tr>
        <td style="background:#fff;padding:0 32px 32px;">
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;">
            <div style="font-size:13px;font-weight:700;color:#1e40af;margin-bottom:8px;">📋 Suggested Next Steps</div>
            <ol style="margin:0;padding-left:18px;font-size:13px;color:#1e40af;line-height:1.8;">
              <li>Contact the patient within <strong>24 hours</strong> via WhatsApp or email</li>
              <li>Share your treatment plan and cost estimate (with 10% HospitalGuru discount applied)</li>
              <li>CC <a href="mailto:care@hospitalguru.com" style="color:#1d4ed8;">care@hospitalguru.com</a> for coordination support</li>
            </ol>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#1e293b;border-radius:0 0 12px 12px;padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="color:#94a3b8;font-size:11px;">HospitalGuru.com — care@hospitalguru.com</td>
            <td align="right" style="color:#64748b;font-size:11px;">Ref: ${data.inquiryNumber}</td>
          </tr></table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = `
LEAD ACCEPTED — Patient Contact Details
Ref: ${data.inquiryNumber}
${"=".repeat(50)}
Name:    ${data.patientName ?? "Not provided"}
Phone:   ${data.patientPhone ?? "Not provided"}
Email:   ${data.patientEmail ?? "Not provided"}
Country: ${data.patientCountry ?? "CIS Region"}
Condition: ${data.condition ?? "Not specified"}
${data.medicalSummary ? `\nSummary: ${data.medicalSummary}` : ""}

REMINDER: Offer this patient the HospitalGuru Special — minimum 10% discount.
Next step: Contact patient within 24 hours. CC care@hospitalguru.com.
`.trim();

  return { subject, html, text };
}
