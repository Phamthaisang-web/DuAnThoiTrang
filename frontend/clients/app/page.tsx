"use client";

import type React from "react";

import CardProduct from "@/components/CardProduct";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Star, Crown, ShoppingBag } from "lucide-react";

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
          "http://localhost:8080/api/v1/products?limit=10"
        );
        setProducts(productsRes.data.data.products || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  const backgrounds = [
    "http://localhost:8080/upload/images/nen1.jpg",
    "http://localhost:8080/upload/images/nen2.jpg",
    "http://localhost:8080/upload/images/nen3.jpg",
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="px-20 py-8">
        {/* Banner */}
        <div className="flex justify-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-12 border border-gray-100">
          <div className="w-[800px] h-[400px] overflow-hidden rounded-xl relative shadow-lg">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
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
                  className="relative w-[800px] h-[400px] flex-shrink-0"
                >
                  <img
                    src={src || "/placeholder.svg"}
                    alt={`bg-${index}`}
                    className="w-[800px] h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Banner Indicators */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {backgrounds.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBg(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentBg ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between ml-6">
            <div className="relative group">
              <img
                src="http://localhost:8080/upload/images/z6745449999064e1c686f3c13f6b4033e851ec634af898-1750945358806.jpg"
                alt=""
                className="w-[150px] h-[200px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="relative group">
              <img
                src="http://localhost:8080/upload/images/z67454695079787829f12aa17af2e7eb8e1bce2951d0d0-1750945755889.jpg"
                alt=""
                className="w-[200px] h-[200px] object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>

        {/* Sản phẩm mới nhất */}
        <div className="relative mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center mr-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Sản Phẩm Mới Nhất
              </h1>
              <p className="text-gray-600 text-sm">
                Khám phá những xu hướng thời trang hot nhất
              </p>
            </div>
          </div>

          <button
            onMouseDown={() => startScrolling(-20, scrollRef2, scrollInterval2)}
            onMouseUp={() => stopScrolling(scrollInterval2)}
            onMouseLeave={() => stopScrolling(scrollInterval2)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 border border-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            ref={scrollRef2}
            className="flex overflow-x-auto space-x-6 scrollbar-hide scroll-smooth py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-[250px]">
                <CardProduct product={product} />
              </div>
            ))}
          </div>

          <button
            onMouseDown={() => startScrolling(20, scrollRef2, scrollInterval2)}
            onMouseUp={() => stopScrolling(scrollInterval2)}
            onMouseLeave={() => stopScrolling(scrollInterval2)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 border border-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Giới thiệu */}
        <div className="bg-gradient-to-r from-white via-slate-100 to-slate-900 w-full h-[300px] shadow-2xl rounded-2xl p-8 flex items-center border border-gray-200">
          <div className="flex-1">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-gray-200">
              <svg
                className="w-4 h-4 mr-2 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Thương Hiệu Uy Tín
            </div>

            <h2 className="w-[500px] text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-600 bg-clip-text text-transparent">
                Thời Trang Hàng Hiệu Đẳng Cấp Thế Giới
              </span>
            </h2>

            <p className="w-[500px] text-gray-700 leading-relaxed mb-6">
              Cửa hàng chúng tôi tự hào mang đến bộ sưu tập các dòng quần thời
              trang cao cấp đến từ những thương hiệu hàng đầu thế giới như{" "}
              <span className="font-semibold text-slate-800">
                Gucci, Chanel, Louis Vuitton
              </span>
              , hội tụ đủ phong cách – chất lượng – đẳng cấp.
            </p>

            <button className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg transition-all duration-200 flex items-center">
              Khám Phá Ngay
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="ml-auto h-full">
            <img
              src="http://localhost:8080/upload/images/nen0.jpg"
              alt=""
              className="h-full object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
