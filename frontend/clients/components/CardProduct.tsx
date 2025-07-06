"use client";
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
interface Product {
  _id: string;
  name: string;
  price: number;
  stockQuantity: number;
  images: { url: string; altText?: string }[];
  slug: string;
}

export default function CardProduct({ product }: { product: Product }) {
  return (
    <li
      key={product._id}
      className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border flex flex-col items-start text-left h-full"
    >
      <Link
        href={`/product/${product._id}`}
        className="w-full h-full flex flex-col"
      >
        <div className="w-full mb-4 overflow-hidden rounded-md flex justify-center items-center bg-white aspect-square">
          {product.images[0]?.url && (
            <img
              src={`${apiUrl}${product.images[0].url}`}
              alt={product.images[0]?.altText || product.name}
              className="object-cover  h-full"
            />
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between w-full text-sm">
          <h3
            className="font-semibold text-gray-800 mb-1 truncate"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-gray-600 mb-1">
            Giá:{" "}
            <span className="text-red-500">
              {product.price.toLocaleString()}₫
            </span>
          </p>
          <p className="text-blue-500">Còn lại: {product.stockQuantity}</p>
        </div>
      </Link>
    </li>
  );
}
