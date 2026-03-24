import { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const UpdateSchema = z.object({
  status: z.enum(["pending_review", "new", "in_progress", "quote_sent", "accepted", "completed", "cancelled"]).optional(),
  internalNotes: z.string().max(2000).optional(),
  assignedTo: z.string().max(200).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const inquiry = await db.inquiry.update({
    where: { id },
    data: parsed.data,
  });

  return Response.json({ success: true, inquiry });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inquiry = await db.inquiry.findUnique({
    where: { id },
  });

  if (!inquiry) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ data: inquiry });
}
