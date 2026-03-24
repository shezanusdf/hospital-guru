import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with test inquiries...");

  const testInquiries = [
    {
      inquiryNumber: "HG-TEST-001",
      guestName: "Иван Петров",
      guestEmail: "ivan.petrov@example.com",
      guestPhone: "+7 900 123 4567",
      guestCountry: "Russia 🇷🇺",
      guestLanguage: "ru",
      treatmentName: "Heart Bypass Surgery (CABG)",
      medicalSummary: "Patient has been diagnosed with triple vessel coronary artery disease. Looking for treatment options in India.",
      urgency: "urgent",
      source: "chatbot",
      status: "new",
      chatContext: JSON.stringify({ name: "Иван Петров", email: "ivan.petrov@example.com", phone: "+7 900 123 4567", country: "Russia", condition: "Heart Bypass Surgery", language: "ru", leadCaptured: true }),
    },
    {
      inquiryNumber: "HG-TEST-002",
      guestName: "Айгерим Сейткали",
      guestEmail: "aigerim@example.kz",
      guestPhone: "+7 701 987 6543",
      guestCountry: "Kazakhstan 🇰🇿",
      guestLanguage: "ru",
      treatmentName: "Knee Replacement",
      medicalSummary: "Both knees require replacement. Age 58, no other major conditions.",
      urgency: "routine",
      source: "web_form",
      status: "in_progress",
    },
    {
      inquiryNumber: "HG-TEST-003",
      guestName: "Olena Kovalenko",
      guestEmail: "olena.kovalenko@gmail.com",
      guestPhone: "+380 67 234 5678",
      guestCountry: "Ukraine 🇺🇦",
      guestLanguage: "uk",
      treatmentName: "IVF Treatment",
      medicalSummary: "Second IVF attempt. Previous IVF failed in Kyiv. Looking for better success rates in India.",
      urgency: "routine",
      source: "chatbot",
      status: "quote_sent",
    },
    {
      inquiryNumber: "HG-TEST-004",
      guestName: "Dmitri Volkov",
      guestEmail: "d.volkov@mail.ru",
      guestPhone: "+7 495 000 1122",
      guestCountry: "Russia 🇷🇺",
      guestLanguage: "ru",
      treatmentName: "Liver Transplant",
      medicalSummary: "Diagnosed with end-stage liver cirrhosis. On waiting list in Moscow for 18 months. Seeking options abroad.",
      urgency: "emergency",
      source: "web_form",
      status: "new",
      internalNotes: "Patient is very urgent — follow up immediately. Son (Sergei) speaks English: +7 495 000 1123",
    },
  ];

  for (const inq of testInquiries) {
    await prisma.inquiry.upsert({
      where: { inquiryNumber: inq.inquiryNumber },
      update: {},
      create: inq,
    });
  }

  console.log(`✓ ${testInquiries.length} test inquiries seeded`);
  console.log("\n✅ Seeding complete. Visit http://localhost:3000/admin to see the data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
