import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /yt-dlp$/,
      use: "file-loader",
    });
    return config;
  },
};

export default nextConfig;
