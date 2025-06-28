import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"], // 👈 Thêm dòng này
  },
};

export default nextConfig;
