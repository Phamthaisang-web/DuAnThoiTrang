"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShoppingBag,
  Plus,
  Edit,
  MapPin,
  Phone,
  User,
  Truck,
  Shield,
  CheckCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import AddressModal from "../../components/AddressModal";
import Image from "next/image";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">(
    "COD"
  );
  const [bankInfoIsSet, setBankInfoIsSet] = useState(false);

  const accessToken = tokens?.accessToken;
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/addresses", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Không thể tải địa chỉ");
      const data = await res.json();
      const fetchedAddresses = data.data.addresses || [];
      setAddresses(fetchedAddresses);
      if (!selectedAddressId) {
        const defaultAddress = fetchedAddresses.find((a: any) => a.isDefault);
        setSelectedAddressId(
          defaultAddress?._id || fetchedAddresses[0]?._id || null
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải địa chỉ");
    }
  };

  useEffect(() => {
    if (!user || !accessToken) {
      toast.error("Bạn cần đăng nhập để thanh toán.");
      router.replace("/auth");
      return;
    }
    fetchAddresses();
  }, [user, accessToken, router]);

  const handleCheckout = async () => {
    if (!selectedAddressId || isLoading) {
      toast.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    if (paymentMethod === "BANK_TRANSFER" && !bankInfoIsSet) {
      toast.error(
        "Thông tin chuyển khoản chưa được cập nhật. Vui lòng chọn phương thức khác."
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/orders", {
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

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Tạo đơn hàng thất bại");
        } else {
          throw new Error("Lỗi server: Không phản hồi JSON.");
        }
      }

      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push("/orderdetail");
    } catch (err: any) {
      toast.error("Lỗi đặt hàng: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddressAdded = () => {
    fetchAddresses();
    setEditingAddress(null);
  };

  const handleCloseModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddress(null);
  };

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center px-4">
        <div className="text-center bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-gray-200 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            Không có sản phẩm
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Giỏ hàng trống, hãy thêm sản phẩm để đặt hàng.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-black text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200"
          >
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-4 px-2">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center mr-3">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Xác nhận đặt hàng
                </h1>
                <p className="text-gray-600 text-sm">
                  Kiểm tra thông tin và hoàn tất đơn hàng
                </p>
              </div>
            </div>
            <div>
              <Link
                href="/cart"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Trở về</span>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Địa chỉ giao hàng */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center mr-2">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Địa chỉ giao hàng
                  </h2>
                </div>

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      onClick={() => setSelectedAddressId(address._id)}
                      className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 ${
                        selectedAddressId === address._id
                          ? "border-slate-500 bg-slate-50 shadow"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 text-sm">
                          <div className="flex items-center mb-1">
                            <User className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="font-medium text-gray-900">
                              {address.receiverName}
                            </p>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="flex items-center mb-1">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <p className="text-gray-700">{address.phone}</p>
                          </div>
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-0.5" />
                            <p className="text-gray-700 leading-snug">
                              {address.addressLine}, {address.ward},{" "}
                              {address.district}, {address.city}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address);
                          }}
                          className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-slate-600 hover:text-slate-800 hover:border-slate-400 transition-colors text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm địa chỉ mới
                  </button>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center mr-2">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Phương thức thanh toán
                  </h2>
                </div>

                <div className="space-y-2 text-sm">
                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500"
                    />
                    <div className="ml-3 flex items-center">
                      <Truck className="w-4 h-4 text-amber-500 mr-2" />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                    <input
                      type="radio"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === "BANK_TRANSFER"}
                      onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500"
                    />
                    <div className="ml-3 flex items-center">
                      <CreditCard className="w-4 h-4 text-blue-500 mr-2" />
                      <span>Chuyển khoản ngân hàng</span>
                    </div>
                  </label>
                </div>

                {paymentMethod === "BANK_TRANSFER" && (
                  <div className="mt-3 bg-yellow-50 border border-amber-200 rounded-lg p-3 text-sm">
                    {bankInfoIsSet ? (
                      <div className="space-y-1">
                        <p>
                          <strong>Ngân hàng:</strong> ACB - 123456789
                        </p>
                        <p>
                          <strong>Chủ tài khoản:</strong> Nguyễn Văn A
                        </p>
                        <p>
                          <strong>Nội dung:</strong> Thanh toán đơn hàng{" "}
                          {user?._id}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <Shield className="w-4 h-4 mr-2" />
                        <p className="font-semibold">
                          Thông tin chuyển khoản chưa được cập nhật.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Danh sách sản phẩm */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center mr-2">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Sản phẩm đặt hàng
                  </h2>
                </div>

                <div className="space-y-3 text-sm">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={`http://localhost:8080${item.image}`}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <div className="flex gap-2 mt-0.5 text-xs">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-full">
                            Size: {item.size}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-full">
                            Màu: {item.color}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right font-bold text-gray-900 text-sm">
                        {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 sticky top-4">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-gray-700 rounded-md flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="p-4 space-y-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Tạm tính ({cart.length} SP)
                      </span>
                      <span className="font-semibold">
                        {totalAmount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-semibold text-emerald-600">
                        Miễn phí
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">
                        Tổng cộng
                      </span>
                      <span className="text-base font-bold bg-gradient-to-r from-slate-800 to-gray-900 bg-clip-text text-transparent">
                        {totalAmount.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || !selectedAddressId}
                    className={`w-full py-3 rounded-md font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-sm ${
                      isLoading || !selectedAddressId
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow hover:shadow-md"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Đặt hàng ngay
                      </>
                    )}
                  </button>

                  {/* Trust Badges */}
                  <div className="space-y-2 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-2 text-green-500" />
                      Thanh toán an toàn & bảo mật
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-3.5 h-3.5 mr-2 text-blue-500" />
                      Giao hàng nhanh chóng
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-2 text-purple-500" />
                      Hỗ trợ 24/7
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseModal}
        onAddressAdded={handleAddressAdded}
        editingAddress={editingAddress}
      />
    </>
  );
}
