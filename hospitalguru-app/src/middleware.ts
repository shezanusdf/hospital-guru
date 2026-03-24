import { NextRequest, NextResponse } from "next/server";

// Protect /admin routes with basic auth in production
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;

  // If no password configured, block access entirely
  if (!adminPassword) {
    return new NextResponse("Admin not configured", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="HospitalGuru Admin"' },
    });
  }

  const base64 = authHeader.split(" ")[1];
  const decoded = atob(base64);
  const [user, pass] = decoded.split(":");

  if (user !== "admin" || pass !== adminPassword) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="HospitalGuru Admin"' },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
