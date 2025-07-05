import type { NextConfig } from "next";
import type { Configuration } from "webpack";

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

  // Webpack 설정 추가
  webpack(config: Configuration) {
    config.module?.rules?.push({
      test: /\.css$/,
      use: ["style-loader", "css-loader"],
    });
    return config;
  },
};

export default nextConfig;
