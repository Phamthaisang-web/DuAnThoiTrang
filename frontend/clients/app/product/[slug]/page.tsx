"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductImageSlider from "@/components/ProductImageSlider";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/stores/useAuthStore";
import { CartItem } from "@/types/cart";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  sizes: string[];
  colors: string[];
  stockQuantity: number;

  images: { url: string; altText?: string }[];
  category: { _id: string; name: string; slug: string };
  brand: { _id: string; name: string; slug: string };
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`http://localhost:8080/api/v1/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { user, hydrated } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false); // thêm dòng này
  useEffect(() => {
    if (!slug) return;
    getProduct(slug)
      .then((p) => setProduct(p))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!product) return <div className="p-8">Đang tải sản phẩm...</div>;

  const handleAddToCart = () => {
    if (isAdding) return; // tránh click liên tục

    if (!hydrated) return;

    if (!user) {
      toast.custom((t) => (
        <div className="bg-white px-6 py-4 rounded shadow border flex flex-col items-center space-y-2">
          <span>Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng.</span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              router.push("/login");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            OK
          </button>
        </div>
      ));
      return;
    }

    if (product.sizes.length > 0 && !selectedSize) {
      toast("Vui lòng chọn kích cỡ.");
      return;
    }

    if (product.colors.length > 0 && !selectedColor) {
      toast("Vui lòng chọn màu sắc.");
      return;
    }

    if (product.stockQuantity === 0) {
      toast("Sản phẩm đã hết hàng.");
      return;
    }

    setIsAdding(true); // ✅ chỉ đặt ở đây, sau khi mọi điều kiện hợp lệ

    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || "",
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      stock: product.stockQuantity,
    };

    try {
      addToCart(cartItem);
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImageSlider
          images={product.images}
          productName={product.name}
        />

        <div>
          <h1 className="text-xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-red-600 mb-4">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>
          <p className="mb-6">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Kích cỡ:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Màu sắc:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded ${
                      selectedColor === color
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hydrated && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`bg-black text-white px-6 py-3 rounded transition-colors duration-300
    ${
      isAdding
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-white hover:text-black hover:border"
    }
  `}
            >
              {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
