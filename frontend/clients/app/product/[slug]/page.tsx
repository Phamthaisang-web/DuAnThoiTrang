"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductImageSlider from "@/components/ProductImageSlider";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/stores/useAuthStore";
import { CartItem } from "@/types/cart";
import toast from "react-hot-toast";
import CardProduct from "@/components/CardProduct";
import { ArrowLeft } from "lucide-react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
  category: { _id: string; name: string; slug: string } | string[];
  brand: { _id: string; name: string; slug: string };
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { user, hydrated } = useAuthStore();

  const fetchProduct = async (slug: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/products/${slug}`);
      if (!res.ok) throw new Error("Không thể tải sản phẩm");

      const json = await res.json();
      const p = json.data as Product;
      setProduct(p);

      const categoryId = Array.isArray(p.category)
        ? p.category[0]
        : p.category?._id;

      if (categoryId && categoryId.length === 24) {
        const related = await getRelatedProducts(categoryId, p._id);
        setRelatedProducts(related);
      } else {
        console.warn("Invalid category ID:", p.category);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải sản phẩm");
    }
  };

  const getRelatedProducts = async (
    categoryId: string,
    excludeProductId: string
  ): Promise<Product[]> => {
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/products?category=${categoryId}`
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Lỗi server: ${errText}`);
      }

      const json = await res.json();
      const all: Product[] = json.data?.products || json.data || [];
      return all.filter((p: Product) => p._id !== excludeProductId);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm liên quan:", error);
      return [];
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="p-8 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (isAdding || !hydrated) return;

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

    setIsAdding(true);

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
    <div className="container mx-auto px-4 md:px-8 py-10 text-sm text-gray-700">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImageSlider
          images={product.images}
          productName={product.name}
        />

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
            {product.name}
          </h1>
          <p className="text-2xl text-red-600 font-semibold mb-4 animate-pulse">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>
          <p className="mb-6 text-gray-600">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Kích cỡ:</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-full font-medium transition duration-200 ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "text-gray-700 hover:bg-gray-100"
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
              <h3 className="font-semibold mb-2">Màu sắc:</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-full font-medium transition duration-200 ${
                      selectedColor === color
                        ? "bg-black text-white border-black"
                        : "text-gray-700 hover:bg-gray-100"
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
              className={`w-full mt-4 px-6 py-3 text-center rounded-full font-semibold transition-colors duration-300 border ${
                isAdding
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-black text-white hover:bg-white hover:text-black hover:border-black"
              }`}
            >
              {isAdding ? "Đang thêm..." : "🛒 Thêm vào giỏ hàng"}
            </button>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 8).map((item) => (
              <div
                key={item._id}
                className="transition-transform transform hover:scale-105 duration-300"
              >
                <CardProduct product={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
