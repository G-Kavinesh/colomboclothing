import type { NextConfig } from "next";

// Built as a full Next.js app on Vercel (not a static export) so server routes such as
// /api/subscribers can run.
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
