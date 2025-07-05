"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { Typography, Tag, Descriptions, message, Button } from "antd";
import "../styles/print.css"; // Nếu bạn có file CSS riêng, hoặc dùng global CSS
import { env } from "../constants/getEnvs";

const { Title } = Typography;

const statusColors: Record<string, string> = {
  pending: "orange",
  confirmed: "blue",
  shipped: "cyan",
  delivered: "green",
  cancelled: "red",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

interface OrderDetailData {
  _id: string;
  user: {
    fullName: string;
    email: string;
  };
  address: {
    addressLine: string;
    ward: string;
    district: string;
    city: string;
    phone: string;
  };
  orderDate: string;
  status: string;
  totalAmount: number;
}

interface ProductInOrder {
  _id: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  unitPrice: number;
  size: string;
}

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [products, setProducts] = useState<ProductInOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const { tokens } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      fetchOrder();
      fetchOrderDetails();
    }
  }, [tokens]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${env.API_URL}/api/v1/orders/${id}`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setOrder(res.data.data);
    } catch (err) {
      message.error("Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(
        `${env.API_URL}/api/v1/order-details?orderId=${id}`,
        {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        }
      );
      setProducts(res.data.data.data);
    } catch (err) {
      message.error("Không thể tải sản phẩm trong đơn hàng");
    }
  };

  if (!order) return <div>Đang tải...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title level={3}>🧾 Chi tiết đơn hàng</Title>

      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Mã đơn hàng">
          <strong>{order._id.slice(-10).toUpperCase()}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Khách hàng">
          {order.user.fullName} ({order.user.email})
        </Descriptions.Item>

        <Descriptions.Item label="Địa chỉ giao hàng">
          {order.address.addressLine}, {order.address.ward},{" "}
          {order.address.district}, {order.address.city}
          <br />
          <span>SĐT: {order.address.phone}</span>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày đặt">
          {new Date(order.orderDate).toLocaleString("vi-VN")}
        </Descriptions.Item>

        <Descriptions.Item label="Tổng tiền">
          {order.totalAmount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Descriptions.Item>

        {/* Ẩn trạng thái khi in */}
        <Descriptions.Item label="Trạng thái" className="print-hidden">
          <Tag color={statusColors[order.status]}>
            {statusLabels[order.status]}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Title level={4} className="mt-6">
        📦 Sản phẩm trong đơn hàng
      </Title>
      {products.length === 0 ? (
        <p>Không có sản phẩm nào.</p>
      ) : (
        <div className="border rounded p-4">
          {products.map((item) => (
            <div key={item._id} className="mb-4 border-b pb-2">
              <p>
                <strong>Tên sản phẩm:</strong> {item.product.name}
              </p>
              <p>
                <strong>Size:</strong> {item.size}
              </p>
              <p>
                <strong>Số lượng:</strong> {item.quantity}
              </p>
              <p>
                <strong>Đơn giá:</strong>{" "}
                {item.unitPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-6 print-hidden">
        <Button type="primary" onClick={() => navigate("/orders")}>
          Quay lại danh sách
        </Button>

        {/* Chỉ hiện nút in nếu đơn KHÔNG bị hủy */}
        {order.status !== "cancelled" && (
          <Button type="default" onClick={() => window.print()}>
            In hóa đơn
          </Button>
        )}
      </div>
    </div>
  );
}
