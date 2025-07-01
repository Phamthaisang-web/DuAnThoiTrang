"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  ShoppingBag,
} from "lucide-react";

type OrderItem = {
  product: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  name?: string;
};

type Order = {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  address?: {
    addressLine: string;
    ward: string;
    district: string;
    city: string;
    phone: string;
  };
};

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<any> }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },
  shipped: {
    label: "Đang giao",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Package,
  },
  completed: {
    label: "Hoàn tất",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export default function OrderPage() {
  const { tokens } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/orders/me", {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Không thể tải đơn hàng");
      const data = await res.json();
      setOrders(data.data.orders || []);
    } catch (err) {
      toast.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    const confirmCancel = confirm("Bạn có chắc muốn hủy đơn hàng này?");
    if (!confirmCancel) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (!res.ok) throw new Error("Huỷ đơn hàng thất bại");
      toast.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (err) {
      toast.error("Lỗi khi huỷ đơn hàng");
    }
  };

  useEffect(() => {
    if (!tokens?.accessToken) {
      toast.error("Vui lòng đăng nhập");
      router.replace("/auth");
    } else {
      fetchOrders();
    }
  }, [tokens, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center px-4">
        <div className="text-center bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-gray-200 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            Chưa có đơn hàng
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-black text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200"
          >
            Bắt đầu mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-lg flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng của bạn
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý đơn hàng của bạn
              </p>
            </div>
          </div>
        </div>
        {/* Order Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {orders.length}
            </h3>
            <p className="text-gray-600">Tổng đơn hàng</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {
                orders.filter((o) =>
                  ["completed", "delivered"].includes(o.status)
                ).length
              }
            </h3>
            <p className="text-gray-600">Đã hoàn thành</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {
                orders.filter((o) =>
                  ["pending", "confirmed", "shipped"].includes(o.status)
                ).length
              }
            </h3>
            <p className="text-gray-600">Đang xử lý</p>
          </div>
        </div>
        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo =
              statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Mã đơn:{" "}
                          <span className="font-bold text-gray-900">
                            #{order._id.slice(-10).toUpperCase()}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-4 h-4 mr-2" />
                      {statusInfo.label}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {item.name || "Sản phẩm không tên"}
                          </h3>
                          <div className="flex gap-3 text-sm">
                            <span className="px-2 py-1 bg-white rounded-full text-gray-600">
                              Số lượng: {item.quantity}
                            </span>
                            {item.size && (
                              <span className="px-2 py-1 bg-white rounded-full text-gray-600">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="px-2 py-1 bg-white rounded-full text-gray-600">
                                Màu: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            ₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-6 border-t border-gray-200">
                    {/* Address Info */}
                    {order.address && (
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          Địa chỉ giao hàng
                        </h4>
                        <div className="bg-slate-50 rounded-lg p-4">
                          <p className="text-gray-700 mb-2">
                            {order.address.addressLine}, {order.address.ward},{" "}
                            {order.address.district}, {order.address.city}
                          </p>
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{order.address.phone}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Total & Actions */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          Tổng thanh toán
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-gray-900 bg-clip-text text-transparent">
                          {order.totalAmount.toLocaleString("vi-VN")} ₫
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {["pending", "confirmed"].includes(order.status) && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg font-medium transition-all duration-200 flex items-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Hủy đơn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
