"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Select, message, Typography, Tag, Space } from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { env } from "../constants/getEnvs";

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
  return_requested: "gold",
  returned: "gray",
  cancelled: "red",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao",
  delivered: "Đã giao",
  return_requested: "Yêu cầu trả hàng",
  returned: "Đã trả hàng",
  cancelled: "Đã hủy",
};

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
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
      setLoading(true);
      const res = await axios.get(`${env.API_URL}/api/v1/orders`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
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
        `${env.API_URL}/api/v1/orders/${id}`,
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
          style={{ width: 180 }}
          disabled={["cancelled", "returned", "delivered"].includes(status)}
        >
          {Object.keys(statusColors)
            .filter((s) => {
              if (record.status === "return_requested") return s === "returned";
              if (s === "return_requested") return false;
              if (["cancelled", "returned"].includes(record.status))
                return false;
              if (s === "returned" && record.status !== "return_requested")
                return false;
              return true;
            })
            .map((s) => (
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
            onClick={() => navigate(`/orders/${record._id}`)}
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

  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Title level={3}>📦 Quản Lý Đơn Hàng</Title>

      {/* Bộ lọc trạng thái */}
      <div className="mb-4 flex gap-4 items-center">
        <span>Lọc theo trạng thái:</span>
        <Select
          allowClear
          placeholder="Chọn trạng thái"
          value={statusFilter ?? undefined}
          onChange={(value) => setStatusFilter(value || null)}
          style={{ width: 240 }}
        >
          <Option value={null}>Tất cả trạng thái</Option>
          {Object.entries(statusLabels).map(([key, label]) => {
            const count = orders.filter((o) => o.status === key).length;
            return (
              <Option key={key} value={key}>
                {label} ({count})
              </Option>
            );
          })}
        </Select>
      </div>

      {/* Bảng đơn hàng */}
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default OrderPage;
