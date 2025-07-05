// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "139.150.73.107",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
