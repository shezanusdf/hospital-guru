import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/admin": [path.join(__dirname, "src/generated/prisma/**/*")],
    "/api/inquiries": [path.join(__dirname, "src/generated/prisma/**/*")],
    "/api/inquiries/[id]": [path.join(__dirname, "src/generated/prisma/**/*")],
    "/api/chat": [path.join(__dirname, "src/generated/prisma/**/*")],
  },
};

export default nextConfig;
