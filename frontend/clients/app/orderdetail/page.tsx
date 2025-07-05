"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import ConfirmDialog from "@/components/ConfirmDialog"; // nếu không inline
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
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
    color: "bg-amber-500 text-white",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-500 text-white",
    icon: CheckCircle,
  },
  shipped: {
    label: "Đang giao",
    color: "bg-purple-500 text-white",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-500 text-white",
    icon: Package,
  },
  return_requested: {
    label: "Yêu cầu trả hàng",
    color: "bg-orange-500 text-white",
    icon: Clock,
  },
  returned: {
    label: "Đã trả hàng",
    color: "bg-gray-500 text-white",
    icon: Package,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-500 text-white",
    icon: XCircle,
  },
};

export default function OrderPage() {
  const { tokens } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { ConfirmDialogUI, confirm } = useConfirmDialog();
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/v1/orders/me`, {
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
    const shouldCancel = await confirm("Bạn có chắc muốn hủy đơn hàng này?");
    if (!shouldCancel) return;
    try {
      const res = await fetch(`${apiUrl}/api/v1/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!res.ok) throw new Error("Huỷ đơn hàng thất bại");
      toast.success("Đã hủy đơn hàng");
      fetchOrders();
    } catch (err) {
      toast.error("Lỗi khi huỷ đơn hàng");
    }
  };

  const requestReturn = async (orderId: string) => {
    const confirmReturn = await confirm("Bạn có chắc muốn yêu cầu trả hàng?");
    if (!confirmReturn) return;

    try {
      const res = await fetch(`${apiUrl}/api/v1/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ status: "return_requested" }),
      });

      if (!res.ok) throw new Error("Yêu cầu trả hàng thất bại");
      toast.success("Đã gửi yêu cầu trả hàng");
      fetchOrders();
    } catch (err) {
      toast.error("Lỗi khi yêu cầu trả hàng");
    }
  };

  const revertReturn = async (orderId: string) => {
    const confirmRevert = await confirm(
      "Bạn có chắc muốn hủy yêu cầu trả hàng?"
    );
    if (!confirmRevert) return;

    try {
      const res = await fetch(`${apiUrl}/api/v1/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
        body: JSON.stringify({ status: "delivered" }),
      });

      if (!res.ok) throw new Error("Hủy yêu cầu trả hàng thất bại");
      toast.success("Đã hủy yêu cầu trả hàng");
      fetchOrders();
    } catch (err) {
      toast.error("Lỗi khi hủy yêu cầu trả hàng");
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải đơn hàng...</p>
      </div>
    );
  }

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đơn hàng của bạn
          </h1>
          <p className="text-gray-600">Lọc đơn hàng theo trạng thái:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus(null)}
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                filterStatus === null
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              Tất cả
            </button>
            {Object.entries(statusConfig).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-2 rounded-full border text-sm font-medium flex items-center gap-1 ${
                  filterStatus === key
                    ? `${val.color} border-none`
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                <val.icon className="w-4 h-4" />
                {val.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Không có đơn hàng phù hợp.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo =
                statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow border p-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Mã đơn:{" "}
                        <span className="font-semibold text-gray-800">
                          #{order._id.slice(-10).toUpperCase()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Ngày tạo:{" "}
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {statusInfo.label}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded"
                      >
                        <div>
                          <Link
                            href={`/product/${item.product}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500">
                            SL: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                            {item.color && ` • Màu: ${item.color}`}
                          </p>
                        </div>
                        <div className="text-right text-gray-800 font-semibold">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                          ₫
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                    <div>
                      {order.address && (
                        <div className="text-sm text-gray-600">
                          <p>
                            <MapPin className="inline w-4 h-4 mr-1" />
                            {order.address.addressLine}, {order.address.ward},{" "}
                            {order.address.district}, {order.address.city}
                          </p>
                          <p className="mt-1">
                            <Phone className="inline w-4 h-4 mr-1" />
                            {order.address.phone}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tổng thanh toán</p>
                      <p className="text-xl font-bold text-gray-900">
                        {order.totalAmount.toLocaleString("vi-VN")} ₫
                      </p>

                      {["pending", "confirmed"].includes(order.status) && (
                        <button
                          onClick={() => cancelOrder(order._id)}
                          className="mt-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg"
                        >
                          Hủy đơn
                        </button>
                      )}

                      {order.status === "delivered" && (
                        <button
                          onClick={() => requestReturn(order._id)}
                          className="mt-3 ml-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 border border-orange-300 rounded-lg"
                        >
                          Trả hàng
                        </button>
                      )}

                      {order.status === "return_requested" && (
                        <button
                          onClick={() => revertReturn(order._id)}
                          className="mt-3 ml-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 border border-green-300 rounded-lg"
                        >
                          Hủy yêu cầu trả hàng
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <ConfirmDialogUI />
    </div>
  );
}
