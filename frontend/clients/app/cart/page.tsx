"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/types/cart";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, clearCart, removeFromCart, updateQuantity } = useCart();
  const { user, tokens } = useAuthStore();
  const accessToken = tokens?.accessToken;
  const router = useRouter();

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // const handleCheckout = async () => {
  //   try {
  //     const orderRes = await fetch("http://localhost:8080/api/v1/orders", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         user: user!._id,
  //         totalAmount,
  //         status: "pending",
  //         items: cart.map((item) => ({
  //           product: item.productId,
  //           quantity: item.quantity,
  //           price: item.price,
  //           size: item.size,
  //           color: item.color,
  //         })),
  //       }),
  //     });

  //     const contentType = orderRes.headers.get("content-type");

  //     if (!orderRes.ok) {
  //       if (contentType?.includes("application/json")) {
  //         const errorData = await orderRes.json();
  //         throw new Error(errorData.message || "Tạo đơn hàng thất bại");
  //       } else {
  //         const errorText = await orderRes.text();
  //         console.error("Server returned HTML instead of JSON:\n", errorText);
  //         throw new Error("Lỗi server: không nhận được phản hồi JSON.");
  //       }
  //     }

  //     toast.success("Đặt hàng thành công!");
  //     clearCart();
  //     router.push("/");
  //   } catch (error: any) {
  //     toast.error("Lỗi đặt hàng: " + error.message);
  //   }
  // };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item);
    } else if (item.stock !== undefined && newQuantity > item.stock) {
      toast.error(`Chỉ còn tối đa ${item.stock} sản phẩm trong kho!`);
    } else if (updateQuantity) {
      updateQuantity(item, newQuantity);
    }
  };

  // ✅ Hiển thị thông báo nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <CreditCard className="mx-auto h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Vui lòng đăng nhập để tiếp tục
          </h1>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem và thanh toán giỏ hàng của mình.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
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
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-lg p-12">
            <div className="mb-8">
              <ShoppingBag className="mx-auto h-20 w-20 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h1>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
              tuyệt vời!
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Giỏ hàng của bạn
            </h1>
            <p className="text-gray-600">
              Bạn có {cart.length} sản phẩm trong giỏ hàng
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <Image
                          src={`http://localhost:8080${item.image}`}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="rounded-lg object-cover border border-gray-200"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-900 truncate pr-4">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex gap-2 mb-4">
                          {item.size && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Màu: {item.color}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <span className="text-xl font-bold text-blue-600">
                            {item.price.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity + 1)
                              }
                              className="p-2 hover:bg-white rounded-md transition-colors duration-200"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-600">Tạm tính</p>
                            <p className="font-bold text-lg text-gray-900">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Tạm tính ({cart.length} sản phẩm)
                      </span>
                      <span className="font-medium">
                        {totalAmount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium text-green-600">
                        Miễn phí
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {totalAmount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => router.push("/order")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Thanh toán
                    </button>

                    <button
                      onClick={() => router.push("/")}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-100">
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
