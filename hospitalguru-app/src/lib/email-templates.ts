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
