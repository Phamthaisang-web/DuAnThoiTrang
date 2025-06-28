"use client";
import React from "react";
import { Twitter, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#3a3a3a] text-white py-10 px-6 mt-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1 */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">
            Hệ thống cửa hàng toàn quốc
          </h3>
          <div className="mb-4">
            <p className="text-red-500 font-semibold">📍 HALU Đội Cấn</p>
            <p>Địa chỉ: A12, Đinh Tiên Hoàng, Q. Hoàn Kiếm, Hà Nội</p>
            <p>Hotline: 0123.456.789</p>
          </div>
          <div>
            <p className="text-red-500 font-semibold">📍 HALU Lữ Gia</p>
            <p>Địa chỉ: A12, Đinh Tiên Hoàng, Q. Hoàn Kiếm, Hà Nội</p>
            <p>Hotline: 0123.456.789</p>
          </div>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">Thông tin</h3>
          <ul className="space-y-2">
            <li>Về chúng tôi</li>
            <li>Điều khoản & Điều kiện</li>
            <li>Chính sách bảo mật</li>
            <li>Chính sách thanh toán</li>
            <li>Chính sách giao hàng</li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase">
            Kết nối với chúng tôi
          </h3>
          <div className="flex space-x-4 mb-6 text-xl">
            <a href="#" className="p-2 border rounded-full hover:text-blue-400">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 border rounded-full hover:text-blue-600">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-2 border rounded-full hover:text-pink-500">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-2 border rounded-full hover:text-red-500">
              <Youtube size={20} />
            </a>
          </div>

          <h3 className="text-lg font-bold mb-3 uppercase">Thanh toán</h3>
          <div className="flex space-x-2 flex-wrap">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/41/VNPAY_logo.png"
              alt="vnpay"
              className="h-6"
            />
            <img
              src="https://img.icons8.com/color/48/000000/mastercard-logo.png"
              alt="mastercard"
              className="h-6"
            />
            <img
              src="https://img.icons8.com/color/48/000000/visa.png"
              alt="visa"
              className="h-6"
            />
            <img
              src="https://img.icons8.com/color/48/000000/jcb.png"
              alt="jcb"
              className="h-6"
            />
            <img
              src="https://img.icons8.com/color/48/000000/unionpay.png"
              alt="unionpay"
              className="h-6"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-300">
        © Copyright 2022–2023 S.Galleria.
      </div>
    </footer>
  );
}
