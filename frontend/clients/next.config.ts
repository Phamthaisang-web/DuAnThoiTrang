import type { NextConfig } from "next";

const domain: string = process.env.DOMAIN as string;

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [domain], // 👈 Thêm dòng này
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 Thêm dòng này để bỏ qua lỗi ESLint khi build
  },
};

export default nextConfig;
