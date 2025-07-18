"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/types/cart";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function CartPage() {
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user, tokens } = useAuthStore();
  const accessToken = tokens?.accessToken;
  const router = useRouter();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item);
    } else if (item.stock !== undefined && newQuantity > item.stock) {
      toast.error(`Chỉ còn tối đa ${item.stock} sản phẩm trong kho!`);
    } else if (updateQuantity) {
      updateQuantity(item, newQuantity);
    }
  };
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <div className="mb-4 sm:mb-6">
            <CreditCard className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-blue-500" />
          </div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Vui lòng đăng nhập để tiếp tục
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Bạn cần đăng nhập để xem và thanh toán giỏ hàng của mình.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 text-sm sm:text-base"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-sm mx-auto text-center bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <ShoppingBag className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-300" />
            </div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Giỏ hàng trống
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
              tuyệt vời!
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 sm:py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-8 px-2">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 flex items-center gap-1">
              <ShoppingBag className="w-4 sm:w-5 h-4 sm:h-5" /> Giỏ hàng của bạn
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Bạn có {cart.length} sản phẩm trong giỏ hàng
            </p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={`${apiUrl}${item.image}`}
                          alt={item.name}
                          width={70}
                          height={70}
                          className="rounded-md object-cover border w-16 h-16 sm:w-20 sm:h-20"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate pr-2 sm:pr-4">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                          </button>
                        </div>

                        {(item.size || item.color) && (
                          <p className="text-[10px] sm:text-xs text-gray-500 mb-1">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && " • "}
                            {item.color && `Màu: ${item.color}`}
                          </p>
                        )}

                        <p className="text-xs sm:text-sm font-bold text-blue-600 mb-1 sm:mb-2">
                          {item.price.toLocaleString("vi-VN")} ₫
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="p-0.5 sm:p-1 hover:bg-white rounded disabled:opacity-50"
                            >
                              <Minus className="h-3 sm:h-4 w-3 sm:w-4" />
                            </button>
                            <span className="w-4 sm:w-6 text-center text-xs sm:text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity + 1)
                              }
                              className="p-0.5 sm:p-1 hover:bg-white rounded"
                            >
                              <Plus className="h-3 sm:h-4 w-3 sm:w-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              Tạm tính
                            </p>
                            <p className="font-semibold text-sm sm:text-base text-gray-800">
                              {(item.price * item.quantity).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              ₫
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-4">
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-blue-600" />
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Tạm tính ({cart.length} sản phẩm)
                      </span>
                      <span className="font-medium">
                        {totalAmount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium text-green-600">
                        Miễn phí
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200" />

                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="font-bold text-gray-900">Tổng cộng</span>
                    <span className="font-bold text-blue-600">
                      {totalAmount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <div className="space-y-2 pt-1 sm:pt-2">
                    <button
                      onClick={() => router.push("/order")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <CreditCard className="h-3 sm:h-4 w-3 sm:w-4" />
                      Thanh toán
                    </button>

                    <button
                      onClick={() => router.push("/")}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded-md transition text-xs sm:text-sm"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>

                  <div className="text-[10px] sm:text-xs text-gray-500 text-center pt-2 sm:pt-3 border-t border-gray-100">
                    🚚 Miễn phí vận chuyển cho đơn hàng trên 500.000₫
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
