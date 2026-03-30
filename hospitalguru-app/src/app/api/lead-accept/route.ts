import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { sendContactReveal } from "@/lib/email";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const forEncoded = req.nextUrl.searchParams.get("for");

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

  // Decode which hospital/doctor clicked the link
  let hospitalEmail = "";
  if (forEncoded) {
    try {
      hospitalEmail = Buffer.from(forEncoded, "base64url").toString("utf-8");
    } catch {
      // ignore decode errors — still process the accept
    }
  }

  // Mark accepted in DB
  await db.inquiry.update({
    where: { id: inquiry.id },
    data: {
      acceptedAt: new Date(),
      acceptedByEmail: hospitalEmail || "unknown",
      status: "accepted",
    },
  });

  // Send full contact details to the hospital that accepted
  if (hospitalEmail) {
    await sendContactReveal({
      inquiryNumber: inquiry.inquiryNumber,
      toEmail: hospitalEmail,
      toName: "HospitalGuru Partner",
      patientName: inquiry.guestName,
      patientEmail: inquiry.guestEmail,
      patientPhone: inquiry.guestPhone,
      patientCountry: inquiry.guestCountry,
      condition: inquiry.treatmentName,
      medicalSummary: inquiry.medicalSummary,
    });
  }

  // Also notify admin that someone accepted
  const adminEmail = process.env.EMAIL_USER;
  if (adminEmail) {
    await sendContactReveal({
      inquiryNumber: inquiry.inquiryNumber,
      toEmail: adminEmail,
      toName: `Admin — accepted by ${hospitalEmail || "unknown"}`,
      patientName: inquiry.guestName,
      patientEmail: inquiry.guestEmail,
      patientPhone: inquiry.guestPhone,
      patientCountry: inquiry.guestCountry,
      condition: inquiry.treatmentName,
      medicalSummary: inquiry.medicalSummary,
    });
  }

  return Response.redirect(new URL("/lead-accepted?status=success", req.url));
}
