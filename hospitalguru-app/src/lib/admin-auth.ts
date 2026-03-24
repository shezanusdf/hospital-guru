import { cookies } from "next/headers";
import crypto from "crypto";

export async function isAdminAuthed(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return true; // No password set = open access (dev mode)

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;

  const expected = crypto
    .createHmac("sha256", adminPassword)
    .update("admin-session")
    .digest("hex");

  return token === expected;
}
