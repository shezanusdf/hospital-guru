import { NextRequest } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";

const PRICE_MAP: Record<number, number> = {
  10: 500000,   // ₹5,000 in paise
  25: 1000000,  // ₹10,000 in paise
  50: 1800000,  // ₹18,000 in paise
};

const BodySchema = z.object({
  credits:       z.union([z.literal(10), z.literal(25), z.literal(50)]),
  pending_token: z.string(),
  pending_for:   z.string(),
  email:         z.string().email(),
});

export async function POST(req: NextRequest) {
  const body   = await req.json();
  const parsed = BodySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return Response.json({ error: "Payment not configured" }, { status: 500 });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  const order = await razorpay.orders.create({
    amount:   PRICE_MAP[parsed.data.credits],
    currency: "INR",
    notes: {
      credits:       String(parsed.data.credits),
      pending_token: parsed.data.pending_token,
      pending_for:   parsed.data.pending_for,
      email:         parsed.data.email,
    },
  });

  return Response.json({
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    keyId,
  });
}
