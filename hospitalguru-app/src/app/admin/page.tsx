import { db } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const [inquiries, totalCount] = await Promise.all([
    db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.inquiry.count(),
  ]);

  const stats = {
    total:      totalCount,
    new:        inquiries.filter((i) => i.status === "new").length,
    inProgress: inquiries.filter((i) => i.status === "in_progress").length,
    completed:  inquiries.filter((i) => i.status === "completed").length,
    chatbot:    inquiries.filter((i) => i.source === "chatbot").length,
    webForm:    inquiries.filter((i) => i.source === "web_form").length,
    urgent:     inquiries.filter((i) => i.urgency === "urgent" || i.urgency === "emergency").length,
  };

  return <AdminClient inquiries={inquiries} stats={stats} />;
}
