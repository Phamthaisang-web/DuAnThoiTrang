"use client";

import Link from "next/link";
import React from "react";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/stores/useAuthStore";
import ProductAIChat from "@/components/ProductAIChat";

export default function Header() {
  const { cartCount } = useCart();
  const { user, hydrated } = useAuthStore();

  if (!hydrated) return null;

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-black p-4 text-white px-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-15">
            <Link href="/">
              <div className="text-lg font-bold">Fashion Store</div>
            </Link>

            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="hover:text-blue-500">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-500">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-blue-500">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-500">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex gap-5 items-center">
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3 text-white">
                <div className="flex items-center gap-2">
                  <Link
                    href="/user"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="bg-white text-black rounded-full p-1">
                      <User className="w-5 h-5" />
                    </div>
                    <span>{user.fullName}</span>
                  </Link>
                </div>
                {/* Nút Đăng xuất đã bị xóa */}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-blue-400"
              >
                <div className="bg-white text-black rounded-full p-1">
                  <User className="w-5 h-5" />
                </div>
                <span>Đăng Nhập</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="border-b-2 p-1 border-black bg-gray-100 w-full flex gap-4 text-gray-500 px-7">
        <Link
          href="/product?slug=thoi-trang-nam"
          className="hover:text-red-500"
        >
          Thời trang nam
        </Link>
        <Link href="/product?slug=thoi-trang-nu" className="hover:text-red-500">
          Thời trang nữ
        </Link>
      </div>
      <ProductAIChat />
    </header>
  );
}
