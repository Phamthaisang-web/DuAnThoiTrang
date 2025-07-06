import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["luxuryfashionbackend.onrender.com"], // 👈 Thêm dòng này
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 Thêm dòng này để bỏ qua lỗi ESLint khi build
  },
};

export default nextConfig;
