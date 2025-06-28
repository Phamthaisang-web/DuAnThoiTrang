// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Không tìm thấy trang</h1>
      <p className="mb-6 text-gray-600">Trang bạn đang tìm không tồn tại.</p>
      <Link href="/" className="text-blue-500 hover:underline">Về trang chủ</Link>
    </div>
  );
}
