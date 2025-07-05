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
  experimental: {
    cssChunking: 'strict',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
