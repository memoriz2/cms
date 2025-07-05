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
  // Next.js 15는 CSS 모듈을 자동으로 처리하므로 별도 설정 불필요
};

export default nextConfig;
