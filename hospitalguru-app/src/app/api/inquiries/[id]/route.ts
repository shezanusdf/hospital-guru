import { NextRequest } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { detectSpecialty } from "@/lib/specialty-detector";
import { NETWORK } from "@/data/network";
import { sendNetworkLeadEmails } from "@/lib/email";

const UpdateSchema = z.object({
  status: z.enum(["pending_review", "new", "in_progress", "quote_sent", "accepted", "completed", "cancelled"]).optional(),
  internalNotes: z.string().max(2000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const inquiry = await db.inquiry.update({
    where: { id },
    data: parsed.data,
  });

  let emailResult: { sent: number; failed: number } | null = null;

  // ── Auto-route lead when admin approves (pending_review → new) ──────────────
  if (parsed.data.status === "new" && !inquiry.networkEmailedAt) {
    const specialty = detectSpecialty(inquiry.treatmentName);
    const contacts = NETWORK[specialty] ?? NETWORK.general;
    const leadToken = randomBytes(32).toString("hex");

    await db.inquiry.update({
      where: { id },
      data: { leadToken, networkEmailedAt: new Date() },
    });

    try {
      emailResult = await sendNetworkLeadEmails({
        inquiryNumber: inquiry.inquiryNumber,
        leadToken,
        specialty,
        condition: inquiry.treatmentName,
        medicalSummary: inquiry.medicalSummary,
        country: inquiry.guestCountry,
        urgency: inquiry.urgency,
        language: inquiry.guestLanguage,
        contacts,
      });
      console.log(`[Lead Routing] ${inquiry.inquiryNumber} → ${specialty}: ${emailResult.sent} sent, ${emailResult.failed} failed`);
    } catch (err) {
      console.error(`[Lead Routing] Failed for ${inquiry.inquiryNumber}:`, err);
      emailResult = { sent: 0, failed: contacts.length };
    }
  }

  return Response.json({ success: true, inquiry, emailResult });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.inquiry.delete({ where: { id } });
  return Response.json({ success: true });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inquiry = await db.inquiry.findUnique({ where: { id } });
  if (!inquiry) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ data: inquiry });
}
