"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  message,
  Typography,
  Tag,
  Space,
} from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

interface Order {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  address: {
    addressLine: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    phone: string;
  };
  orderDate: string;
  status: string;
  totalAmount: number;
}

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

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { tokens } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    }
  }, [tokens]);

  useEffect(() => {
    if (tokens?.accessToken) fetchOrders();
  }, [tokens?.accessToken]);

  const fetchOrders = async () => {
    try {
      console.log("🔐 Token gửi đi:", tokens?.accessToken);
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/v1/orders", {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      console.log("📦 Dữ liệu đơn hàng nhận được:", res.data);
      setOrders(res.data.data.orders);
    } catch (err) {
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/orders/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        }
      );
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "orderCode",
      render: (id: string) => <strong>{id.slice(-10).toUpperCase()}</strong>,
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (user: Order["user"]) => (
        <>
          <strong>{user.fullName}</strong>
          <br />
          <span className="text-xs text-gray-500">{user.email}</span>
        </>
      ),
    },
    {
      title: "Địa chỉ giao",
      dataIndex: "address",
      key: "address",
      render: (addr: Order["address"] | null) =>
        addr ? (
          <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: 250,
            }}
          >
            {addr.addressLine}, {addr.ward}, {addr.district}, {addr.city}
            <br />
            <span className="text-xs text-gray-500">SĐT: {addr.phone}</span>
          </div>
        ) : (
          <i style={{ color: "gray" }}>Không có địa chỉ</i>
        ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) =>
        amount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Order) => (
        <Select
          value={status}
          onChange={(value) => {
            if (value !== status) handleStatusChange(record._id, value);
          }}
          style={{ width: 160 }}
          disabled={status === "cancelled"} // ✅ Không cho chọn nếu đã huỷ
        >
          {Object.keys(statusColors).map((s) => (
            <Option key={s} value={s}>
              <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Order) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/orders/${record._id}`)}
          >
            Chi tiết
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
            Làm mới
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Title level={3}>📦 Quản Lý Đơn Hàng</Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }} // 👈 Thêm dòng này để cuộn ngang
      />
    </div>
  );
};

export default OrderPage;
