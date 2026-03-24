import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin file tracing to this project — prevents scanning parent folders
  // for lockfiles (was causing Turbopack memory spikes + native crashes)
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
