import { NextRequest } from "next/server";
import { createHmac } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";

const BodySchema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
  email:               z.string().email(),
  credits:             z.number().int().positive(),
  pending_token:       z.string(),
  pending_for:         z.string(),
});

export async function POST(req: NextRequest) {
  const body   = await req.json();
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, credits, pending_token, pending_for } = parsed.data;

  // ── Verify Razorpay signature ────────────────────────────────────────────────
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return Response.json({ error: "Payment not configured" }, { status: 500 });
  }

  const expectedSig = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSig !== razorpay_signature) {
    return Response.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  // ── Add credits to HospitalAccount ──────────────────────────────────────────
  await db.hospitalAccount.upsert({
    where:  { email },
    create: { email, creditBalance: credits },
    update: { creditBalance: { increment: credits } },
  });

  // Log the purchase transaction
  await db.creditTransaction.create({
    data: {
      hospitalEmail:    email,
      type:             "purchase",
      credits,
      amountPaid:       0, // actual amount is in Razorpay — fetch if needed
      razorpayOrderId:  razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    },
  });

  // ── Return redirect URL to complete the pending lead accept ──────────────────
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? "https://hospitalguru.com";
  const returnUrl = `${appUrl}/api/lead-accept?token=${encodeURIComponent(pending_token)}&for=${encodeURIComponent(pending_for)}`;

  return Response.json({ success: true, returnUrl });
}
