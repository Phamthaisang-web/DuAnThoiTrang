"use client";
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  ArrowUp,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Về chúng tôi", href: "/about" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: "Facebook",
      href: "#",
      color: "hover:text-blue-600",
    },
    {
      icon: Instagram,
      name: "Instagram",
      href: "#",
      color: "hover:text-pink-600",
    },
    { icon: Twitter, name: "Twitter", href: "#", color: "hover:text-sky-600" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center mr-3">
                <Store className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Fashion Store</h3>
            </div>

            <p className="text-slate-300 mb-4 text-sm leading-relaxed">
              Đại lý ủy quyền các thương hiệu thời trang hàng đầu thế giới.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-slate-300">
                <Phone className="w-4 h-4 mr-2 text-slate-400" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                <span>info@fashionstore.vn</span>
              </div>
              <div className="flex items-start text-slate-300">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                <span>123 Nguyễn Huệ, Q.1, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Kết</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kết Nối</h4>

            {/* Social Links */}
            <div className="flex space-x-3 mb-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-8 h-8 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-200 ${social.color}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            <div className="text-sm text-slate-300 space-y-1">
              <p>✓ 100% Chính hãng</p>
              <p>✓ Giao hàng toàn quốc</p>
              <p>✓ Hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-center md:text-left mb-2 md:mb-0">
              <p className="text-slate-400">
                © 2024 Fashion Store. Tất cả quyền được bảo lưu.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-slate-500 text-xs">
                Made with <Heart className="w-3 h-3 inline text-red-500" /> in
                Vietnam
              </span>
              <button
                onClick={scrollToTop}
                className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
