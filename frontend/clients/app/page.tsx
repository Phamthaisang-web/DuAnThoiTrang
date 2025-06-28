"use client";
import CardProduct from "@/components/CardProduct";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

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

  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollInterval1 = useRef<number | null>(null);
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

  return (
    <div className="px-20">
      {/* Banner */}
      <div className="flex justify-center bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="w-[800px] h-[400px] overflow-hidden rounded-lg relative">
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
              <img
                key={index}
                src={src}
                alt={`bg-${index}`}
                className="w-[800px] h-[400px] object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between ml-4">
          <img
            src="http://localhost:8080/upload/images/z6745449999064e1c686f3c13f6b4033e851ec634af898-1750945358806.jpg"
            alt=""
            className="w-[150px] h-[200px] object-cover rounded-lg"
          />
          <img
            src="http://localhost:8080/upload/images/z67454695079787829f12aa17af2e7eb8e1bce2951d0d0-1750945755889.jpg"
            alt=""
            className="w-[200px] h-[200px] object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Sản phẩm bán chạy */}
      <div className="relative mb-10">
        <h1 className="text-xl mb-4">Sản phẩm bán chạy nhất</h1>

        <button
          onMouseDown={() => startScrolling(-20, scrollRef1, scrollInterval1)}
          onMouseUp={() => stopScrolling(scrollInterval1)}
          onMouseLeave={() => stopScrolling(scrollInterval1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
        >
          &#10094;
        </button>

        <div
          ref={scrollRef1}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth"
        >
          {products.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-[250px]">
              <CardProduct product={product} />
            </div>
          ))}
        </div>

        <button
          onMouseDown={() => startScrolling(20, scrollRef1, scrollInterval1)}
          onMouseUp={() => stopScrolling(scrollInterval1)}
          onMouseLeave={() => stopScrolling(scrollInterval1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
        >
          &#10095;
        </button>
      </div>

      {/* Sản phẩm mới nhất */}
      <div className="relative">
        <h1 className="text-xl mb-4">Sản phẩm mới nhất</h1>

        <button
          onMouseDown={() => startScrolling(-20, scrollRef2, scrollInterval2)}
          onMouseUp={() => stopScrolling(scrollInterval2)}
          onMouseLeave={() => stopScrolling(scrollInterval2)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
        >
          &#10094;
        </button>

        <div
          ref={scrollRef2}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
        >
          &#10095;
        </button>
      </div>
      <div
        className="w-full h-[300px]  shadow-md p-4 mt-10 flex items-center"
        style={{
          background: `linear-gradient(to right, white 0%, black 54%, black 100%)`,
        }}
      >
        <h2
          className="w-[500px] text-lg font-semibold bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(to right, black 50%,  white 50%)",
          }}
        >
          Cửa hàng chúng tôi tự hào mang đến bộ sưu tập các dòng quần thời trang
          cao cấp đến từ những thương hiệu hàng đầu thế giới như
          Gucci,Chanel,Louis Vuitton, hội tụ đủ phong cách – chất lượng – đẳng
          cấp
        </h2>

        <div className="ml-auto h-full">
          <img
            src="http://localhost:8080/upload/images/nen0.jpg"
            alt=""
            className="h-full object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
