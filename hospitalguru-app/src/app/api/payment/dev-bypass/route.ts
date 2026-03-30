import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// ⚠️  DEV ONLY — never runs in production
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not available in production" }, { status: 403 });
  }

  const { email, credits, pending_token, pending_for } = await req.json();

  await db.hospitalAccount.upsert({
    where:  { email },
    create: { email, creditBalance: credits },
    update: { creditBalance: { increment: credits } },
  });

  await db.creditTransaction.create({
    data: { hospitalEmail: email, type: "purchase", credits },
  });

  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const returnUrl = `${appUrl}/api/lead-accept?token=${encodeURIComponent(pending_token)}&for=${encodeURIComponent(pending_for)}`;

  return Response.json({ success: true, returnUrl });
}
