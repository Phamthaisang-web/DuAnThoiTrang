"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, X, Search, Heart, Bell } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/stores/useAuthStore";
import ProductAIChat from "@/components/ProductAIChat";

export default function Header() {
  const { cartCount } = useCart();
  const { user, hydrated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hydrated) return null;

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/product", label: "Sản phẩm" },
    { href: "/contact", label: "Liên hệ" },
  ];

  const categoryLinks = [
    { href: "/product?slug=thoi-trang-nam", label: "Thời trang nam" },
    { href: "/product?slug=thoi-trang-nu", label: "Thời trang nữ" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Main Navigation */}
      <nav
        className={`bg-gradient-to-r from-black via-gray-900 to-black text-white transition-all duration-300 ${
          isScrolled ? "shadow-2xl backdrop-blur-lg bg-black/95" : ""
        }`}
      >
        <div className="container mx-auto px-4 lg:px-20">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group">
              <div className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-blue-400 transition-all duration-300">
                LUXURY FASHION
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative group py-2 px-1 text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative group">
                <div className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* User Section */}
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Profile */}
                  <Link
                    href="/user"
                    className="group flex items-center space-x-2 hover:bg-white/10 rounded-full p-2 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                      {user.fullName}
                    </span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Đăng Nhập</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-lg border-t border-gray-800">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Category Navigation */}
      <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 border-b-2 border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 lg:px-20">
          <div className="flex items-center space-x-8  overflow-x-auto scrollbar-hide">
            {categoryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300 py-2"
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ProductAIChat />
    </header>
  );
}
