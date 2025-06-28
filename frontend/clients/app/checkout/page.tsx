"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { CreditCard, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Link from "next/link";

type Address = {
  _id: string;
  receiverName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
};

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, tokens } = useAuthStore();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showAddressList, setShowAddressList] = useState(false);
  const accessToken = tokens?.accessToken;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thanh toán.");
      router.push("/login");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/addresses", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error("Không thể tải địa chỉ");

        const data = await response.json();
        setAddresses(data.data.addresses || []);

        const defaultAddress = data.data.addresses.find(
          (addr: Address) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        }
      } catch (error) {
        console.error("Lỗi khi tải địa chỉ:", error);
        toast.error("Không thể tải địa chỉ");
      }
    };

    fetchAddresses();
  }, [accessToken, user, router]);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    try {
      const orderRes = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user: user!._id,
          totalAmount,
          status: "pending",
          address: selectedAddressId,
          items: cart.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        }),
      });

      const contentType = orderRes.headers.get("content-type");

      if (!orderRes.ok) {
        if (contentType?.includes("application/json")) {
          const errorData = await orderRes.json();
          throw new Error(errorData.message || "Tạo đơn hàng thất bại");
        } else {
          const errorText = await orderRes.text();
          console.error("Server returned HTML instead of JSON:\n", errorText);
          throw new Error("Lỗi server: không nhận được phản hồi JSON.");
        }
      }

      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push("/");
    } catch (error: any) {
      toast.error("Lỗi đặt hàng: " + error.message);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmed = confirm("Bạn có chắc muốn xóa địa chỉ này?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Xóa địa chỉ thất bại");

      toast.success("Đã xóa địa chỉ");
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }
    } catch (err) {
      toast.error("Không thể xóa địa chỉ");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không có sản phẩm</h2>
          <p className="text-gray-600 mb-6">
            Giỏ hàng trống, hãy thêm sản phẩm để thanh toán.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Xác nhận thanh toán
        </h1>

        {/* Địa chỉ giao hàng */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Địa chỉ giao hàng</h2>

          {addresses.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Không có địa chỉ. Vui lòng thêm địa chỉ giao hàng.
            </p>
          ) : (
            <>
              {!showAddressList ? (
                <>
                  {selectedAddressId && (
                    <div className="p-4 border rounded-lg bg-blue-50 border-blue-600 mb-3">
                      {(() => {
                        const address = addresses.find(
                          (addr) => addr._id === selectedAddressId
                        );
                        if (!address) return null;
                        return (
                          <div>
                            <p className="font-medium">
                              {address.receiverName} - {address.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.addressLine}, {address.ward},{" "}
                              {address.district}, {address.city}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  <button
                    onClick={() => setShowAddressList(true)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Thay đổi địa chỉ
                  </button>
                </>
              ) : (
                <>
                  <ul className="space-y-3 mb-3">
                    {addresses.map((address) => (
                      <li
                        key={address._id}
                        className={`p-4 border rounded-lg relative cursor-pointer ${
                          selectedAddressId === address._id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => {
                          setSelectedAddressId(address._id);
                          setShowAddressList(false);
                        }}
                      >
                        <div>
                          <p className="font-medium">
                            {address.receiverName} - {address.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.addressLine}, {address.ward},{" "}
                            {address.district}, {address.city}
                          </p>
                          {address.isDefault && (
                            <span className="text-xs text-blue-600 font-semibold">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <button
                          className="absolute top-2 right-2 text-red-500 text-xs hover:underline z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address._id);
                          }}
                        >
                          Xóa
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center">
                    <Link href="/address">Thêm địa chỉ</Link>
                    <button
                      onClick={() => setShowAddressList(false)}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                      Hủy
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-6 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} x {item.price.toLocaleString("vi-VN")} ₫
                </p>
              </div>
              <p className="font-bold text-gray-900">
                {(item.quantity * item.price).toLocaleString("vi-VN")} ₫
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <span>Tổng cộng:</span>
          <span className="text-blue-600">
            {totalAmount.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
        >
          <CreditCard className="h-5 w-5" />
          Thanh toán ngay
        </button>
      </div>
    </div>
  );
}
