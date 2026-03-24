import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

// Simple HMAC token — no dependencies needed
function makeToken(password: string): string {
  const secret = process.env.ADMIN_PASSWORD || "fallback";
  return crypto.createHmac("sha256", secret).update("admin-session").digest("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body as { username?: string; password?: string };

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  if (username !== "admin" || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set HTTP-only session cookie
  const token = makeToken(adminPassword);
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return NextResponse.json({ ok: true });
}
