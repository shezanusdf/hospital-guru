import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sendContactReveal } from "@/lib/email";

const FREE_QUOTA = parseInt(process.env.FREE_LEADS_QUOTA ?? "5");

export async function GET(req: NextRequest) {
  const token      = req.nextUrl.searchParams.get("token");
  const forEncoded = req.nextUrl.searchParams.get("for");
  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? "https://hospitalguru.com";

  if (!token) {
    return Response.redirect(new URL("/lead-accepted?status=invalid", req.url));
  }

  const inquiry = await db.inquiry.findUnique({ where: { leadToken: token } });

  if (!inquiry) {
    return Response.redirect(new URL("/lead-accepted?status=invalid", req.url));
  }

  if (inquiry.acceptedAt) {
    return Response.redirect(new URL("/lead-accepted?status=already", req.url));
  }

  // Decode hospital email
  let hospitalEmail = "";
  if (forEncoded) {
    try { hospitalEmail = Buffer.from(forEncoded, "base64url").toString("utf-8"); } catch { /* ignore */ }
  }

  if (!hospitalEmail) {
    return Response.redirect(new URL("/lead-accepted?status=invalid", req.url));
  }

  // ── Credit gate ─────────────────────────────────────────────────────────────
  // Upsert HospitalAccount — auto-created on first contact, no registration needed
  const account = await db.hospitalAccount.upsert({
    where:  { email: hospitalEmail },
    create: { email: hospitalEmail },
    update: {},
  });

  const isFree      = account.freeLeadsUsed < FREE_QUOTA;
  const hasPaidCredits = account.creditBalance > 0;

  if (!isFree && !hasPaidCredits) {
    // No free leads left and no credits — send to payment page
    const buyUrl = `${appUrl}/buy-credits?pending_token=${encodeURIComponent(token)}&pending_for=${encodeURIComponent(forEncoded ?? "")}&email=${encodeURIComponent(hospitalEmail)}`;
    return Response.redirect(buyUrl);
  }

  // ── Deduct and mark inquiry as accepted ─────────────────────────────────────
  if (isFree) {
    await db.hospitalAccount.update({
      where: { email: hospitalEmail },
      data:  { freeLeadsUsed: { increment: 1 } },
    });
    await db.creditTransaction.create({
      data: {
        hospitalEmail,
        type:      "free_lead",
        credits:   -1,
        inquiryId: inquiry.id,
      },
    });
  } else {
    await db.hospitalAccount.update({
      where: { email: hospitalEmail },
      data:  { creditBalance: { decrement: 1 } },
    });
    await db.creditTransaction.create({
      data: {
        hospitalEmail,
        type:      "paid_lead",
        credits:   -1,
        inquiryId: inquiry.id,
      },
    });
  }

  await db.inquiry.update({
    where: { id: inquiry.id },
    data:  { acceptedAt: new Date(), acceptedByEmail: hospitalEmail, status: "accepted" },
  });

  // ── Send contact details to hospital ────────────────────────────────────────
  await sendContactReveal({
    inquiryNumber: inquiry.inquiryNumber,
    toEmail:       hospitalEmail,
    toName:        "HospitalGuru Partner",
    patientName:   inquiry.guestName,
    patientEmail:  inquiry.guestEmail,
    patientPhone:  inquiry.guestPhone,
    patientCountry: inquiry.guestCountry,
    condition:     inquiry.treatmentName,
    medicalSummary: inquiry.medicalSummary,
  });

  // Notify admin
  const adminEmail = process.env.EMAIL_USER;
  if (adminEmail) {
    await sendContactReveal({
      inquiryNumber: inquiry.inquiryNumber,
      toEmail:       adminEmail,
      toName:        `Admin — accepted by ${hospitalEmail} (${isFree ? "free" : "paid"})`,
      patientName:   inquiry.guestName,
      patientEmail:  inquiry.guestEmail,
      patientPhone:  inquiry.guestPhone,
      patientCountry: inquiry.guestCountry,
      condition:     inquiry.treatmentName,
      medicalSummary: inquiry.medicalSummary,
    });
  }

  return Response.redirect(new URL("/lead-accepted?status=success", req.url));
}
