// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        // Production IP (주석처리)
        // hostname: "139.150.73.107",
        // Local Development
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
  // Production IP (주석처리)
  // allowedDevOrigins: ["139.150.73.107"],
  // Local Development
  allowedDevOrigins: ["localhost"],
};

export default nextConfig;
