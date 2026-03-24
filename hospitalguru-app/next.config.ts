import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/admin": ["./src/generated/prisma/**/*"],
    "/api/inquiries": ["./src/generated/prisma/**/*"],
    "/api/inquiries/[id]": ["./src/generated/prisma/**/*"],
    "/api/chat": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
