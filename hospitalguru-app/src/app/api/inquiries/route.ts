import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendInquiryNotification } from "@/lib/email";

const InquirySchema = z.object({
  name:      z.string().min(2).max(200).optional(),
  email:     z.string().email().optional().or(z.literal("")),
  phone:     z.string().min(7).max(25).optional(),
  country:   z.string().max(100).optional(),
  condition: z.string().max(300).optional(),
  message:   z.string().max(2000).optional(),
  source:    z.enum(["web_form", "chatbot", "whatsapp", "phone"]).default("web_form"),
}).refine((d) => d.email || d.phone, {
  message: "Email or phone is required",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InquirySchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, country, condition, message, source } = parsed.data;

    const inquiry = await db.inquiry.create({
      data: {
        inquiryNumber: `HG-${Date.now()}`,
        guestName:    name     || null,
        guestEmail:   email    || null,
        guestPhone:   phone    || null,
        guestCountry: country  || null,
        treatmentName: condition || null,
        medicalSummary: message || null,
        source,
        status: "pending_review",
      },
    });

    // ── Fire email notification (non-blocking) ────────────────────────────
    sendInquiryNotification({
      inquiryNumber: inquiry.inquiryNumber,
      name,
      email,
      phone,
      country,
      condition,
      medicalSummary: message,
      urgency: "routine",
      source,
      createdAt: inquiry.createdAt,
    }).catch((e) => console.error("[Email]", e));

    return Response.json(
      {
        success: true,
        inquiryNumber: inquiry.inquiryNumber,
        message: "Inquiry submitted. Our case manager will contact you within 24 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Inquiry creation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const limit  = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);
  const page   = Math.max(parseInt(searchParams.get("page")  ?? "1"), 1);
  const skip   = (page - 1) * limit;

  const where = {
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
  };

  const [inquiries, total] = await Promise.all([
    db.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    db.inquiry.count({ where }),
  ]);

  return Response.json({ data: inquiries, total, page, limit });
}
