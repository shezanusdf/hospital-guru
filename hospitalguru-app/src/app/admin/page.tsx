import { db } from "@/lib/db";
import { isAdminAuthed } from "@/lib/admin-auth";
import AdminClient from "./AdminClient";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const authed = await isAdminAuthed();

  if (!authed) {
    return <AdminLogin />;
  }

  const [inquiries, totalCount] = await Promise.all([
    db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.inquiry.count(),
  ]);

  // Serialize to plain objects for Client Component
  const plainInquiries = JSON.parse(JSON.stringify(inquiries));

  const stats = {
    total:      totalCount,
    new:        plainInquiries.filter((i: { status: string }) => i.status === "new").length,
    inProgress: plainInquiries.filter((i: { status: string }) => i.status === "in_progress").length,
    completed:  plainInquiries.filter((i: { status: string }) => i.status === "completed").length,
    chatbot:    plainInquiries.filter((i: { source: string }) => i.source === "chatbot").length,
    webForm:    plainInquiries.filter((i: { source: string }) => i.source === "web_form").length,
    urgent:     plainInquiries.filter((i: { urgency: string }) => i.urgency === "urgent" || i.urgency === "emergency").length,
  };

  return <AdminClient inquiries={plainInquiries} stats={stats} />;
}
