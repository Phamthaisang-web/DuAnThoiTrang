"use client";

import type React from "react";
import CardProduct from "@/components/CardProduct";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Star,
  Crown,
  ShoppingBag,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import Link from "next/link";
import PromotionsList from "@/components/PromotionList";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  images: { url: string; altText?: string }[];
  slug: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollInterval2 = useRef<number | null>(null);

  const startScrolling = (
    direction: number,
    ref: React.RefObject<HTMLDivElement | null>,
    intervalRef: React.MutableRefObject<number | null>
  ) => {
    if (intervalRef.current !== null) return;
    const scroll = () => {
      if (ref.current) {
        ref.current.scrollLeft += direction * 10;
        intervalRef.current = requestAnimationFrame(scroll);
      }
    };
    scroll();
  };

  const stopScrolling = (
    intervalRef: React.MutableRefObject<number | null>
  ) => {
    if (intervalRef.current !== null) {
      cancelAnimationFrame(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await axios.get(
          `${apiUrl}/api/v1/products?limit=10`
        );
        setProducts(productsRes.data.data.products || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  const backgrounds = [`${apiUrl}/upload/images/nen1.jpg`];

  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Crown,
      title: "Thương Hiệu Cao Cấp",
      description: "Gucci, Chanel, Louis Vuitton",
      color: "from-amber-500 to-yellow-600",
    },
    {
      icon: Star,
      title: "100% Chính Hãng",
      description: "Cam kết hàng authentic",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: ShoppingBag,
      title: "Giao Hàng Nhanh",
      description: "Miễn phí toàn quốc",
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 mt-2">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10"></div>

        {/* Main Banner */}
        <div className="relative h-[80vh] flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-in-out h-full"
              style={{
                width: `${backgrounds.length * 100}%`,
                transform: `translateX(-${
                  (100 / backgrounds.length) * currentBg
                }%)`,
              }}
            >
              {backgrounds.map((src, index) => (
                <div
                  key={index}
                  className="relative w-full h-full flex-shrink-0"
                >
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`bg-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Content */}
          <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto pt-3">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8 border border-white/20 ">
              <Crown className="w-4 h-4 mr-2 text-amber-400" />
              Thời Trang Hàng Hiệu Cao Cấp
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                LUXURY
              </span>
              <br />
              <span className="text-amber-400">FASHION</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Khám phá bộ sưu tập độc quyền từ những thương hiệu danh tiếng nhất
              thế giới
            </p>
          </div>

          {/* Banner Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
            {backgrounds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBg(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBg
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-20 px-4 md:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="pt-20 px-4 md:px-8 lg:px-20 ">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full text-white font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Sản Phẩm Nổi Bật
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Bộ Sưu Tập Mới Nhất
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Khám phá những xu hướng thời trang hot nhất từ các thương hiệu
                hàng đầu thế giới
              </p>
            </div>

            <div className="relative bg-gray-50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Nút trái */}
              <button
                onMouseDown={() =>
                  startScrolling(-30, scrollRef2, scrollInterval2)
                }
                onMouseUp={() => stopScrolling(scrollInterval2)}
                onMouseLeave={() => stopScrolling(scrollInterval2)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white hover:bg-gray-50 shadow-xl rounded-full flex items-center justify-center transition-all duration-300 border border-gray-100 group"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
              </button>
              {/* Vùng scroll sản phẩm */}
              <div
                ref={scrollRef2}
                className="flex overflow-x-auto space-x-4 md:space-x-8 scrollbar-hide scroll-smooth py-4 md:py-8"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[250px]"
                  >
                    <CardProduct product={product} />
                  </div>
                ))}
              </div>

              {/* Nút phải */}
              <button
                onMouseDown={() =>
                  startScrolling(30, scrollRef2, scrollInterval2)
                }
                onMouseUp={() => stopScrolling(scrollInterval2)}
                onMouseLeave={() => stopScrolling(scrollInterval2)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white hover:bg-gray-50 shadow-xl rounded-full flex items-center justify-center transition-all duration-300 border border-gray-100 group"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-20 px-4 md:px-8 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
            Ưu Đãi Đặc Biệt
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Đừng bỏ lỡ các chương trình khuyến mãi hấp dẫn và ưu đãi giới hạn từ
            các thương hiệu thời trang hàng đầu. Mua sắm ngay để nhận quà tặng
            độc quyền và giảm giá cực sốc!
          </p>
          <PromotionsList />
        </div>
      </div>
      {/* About Section */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl opacity-20 blur-xl"></div>
              <img
                src={`${apiUrl}/upload/images/nen0.jpg`}
                alt="Luxury Fashion"
                className="relative w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>

            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full text-white font-medium mb-8">
                <Award className="w-4 h-4 mr-2" />
                Về Chúng Tôi
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                Thời Trang Hàng Hiệu
                <span className="block text-transparent bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text">
                  Đẳng Cấp Thế Giới
                </span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Cửa hàng chúng tôi tự hào mang đến bộ sưu tập các dòng thời
                trang cao cấp đến từ những thương hiệu hàng đầu thế giới như{" "}
                <span className="font-semibold text-gray-800">
                  Gucci, Chanel, Louis Vuitton
                </span>
                , hội tụ đủ phong cách – chất lượng – đẳng cấp.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Bảo Hành</h4>
                    <p className="text-gray-600 text-sm">Trọn đời</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Giao Hàng</h4>
                    <p className="text-gray-600 text-sm">Miễn phí</p>
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full text-white font-medium mb-8 "
              >
                Khám Phá Ngay
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
