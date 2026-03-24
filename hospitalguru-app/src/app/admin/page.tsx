import { headers } from "next/headers";
import { db } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  // ── Basic auth in production ──────────────────────────────────────────
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword && process.env.NODE_ENV === "production") {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    let authed = false;

    if (authHeader?.startsWith("Basic ")) {
      const decoded = Buffer.from(authHeader.split(" ")[1], "base64").toString();
      const [user, pass] = decoded.split(":");
      authed = user === "admin" && pass === adminPassword;
    }

    if (!authed) {
      // Return 401 with WWW-Authenticate header to trigger browser login prompt
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="HospitalGuru Admin"',
          "Content-Type": "text/plain",
        },
      }) as unknown as React.JSX.Element;
    }
  }

  // ── Fetch data ────────────────────────────────────────────────────────
  const [inquiries, totalCount] = await Promise.all([
    db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.inquiry.count(),
  ]);

  const stats = {
    total:      totalCount,
    new:        inquiries.filter((i: { status: string }) => i.status === "new").length,
    inProgress: inquiries.filter((i: { status: string }) => i.status === "in_progress").length,
    completed:  inquiries.filter((i: { status: string }) => i.status === "completed").length,
    chatbot:    inquiries.filter((i: { source: string }) => i.source === "chatbot").length,
    webForm:    inquiries.filter((i: { source: string }) => i.source === "web_form").length,
    urgent:     inquiries.filter((i: { urgency: string }) => i.urgency === "urgent" || i.urgency === "emergency").length,
  };

  return <AdminClient inquiries={inquiries} stats={stats} />;
}
