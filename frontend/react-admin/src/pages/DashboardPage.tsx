"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  DatePicker,
  Select,
  message,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import axios from "../utils/axiosInstance";
import { Tag } from "antd";
const { Title } = Typography;
const { Option } = Select;

type PickerMode = "date" | "month" | "year";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { tokens, hasHydrated } = useAuthStore();
  const [stats, setStats] = useState<any>({});
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [filterType, setFilterType] = useState<PickerMode>("month");

  useEffect(() => {
    if (!hasHydrated) return;
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập để tiếp tục");
      navigate("/login");
    }
  }, [tokens, hasHydrated]);

  useEffect(() => {
    if (tokens?.accessToken) {
      fetchStats();
      fetchOrders();
    }
  }, [tokens]);

  useEffect(() => {
    if (tokens?.accessToken) {
      fetchRevenue();
    }
  }, [selectedDate, filterType]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/statistics/summary");
      setStats(res.data.data);
    } catch {
      message.error("Lỗi khi lấy dữ liệu tổng quan");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders?limit=5");
      setOrders(res.data.data.orders);
    } catch {
      message.error("Lỗi khi lấy đơn hàng gần đây");
    }
  };

  const fetchRevenue = async () => {
    const year = selectedDate.year();
    const month = selectedDate.month() + 1;
    const day = selectedDate.date();
    let query = `year=${year}`;
    if (filterType === "month") query += `&month=${month}`;
    if (filterType === "date") query += `&month=${month}&day=${day}`;

    try {
      const res = await axios.get(`/statistics/revenue?${query}`);
      setRevenueData(res.data.data || []);
    } catch {
      setRevenueData([]);
      message.error("Lỗi khi lấy dữ liệu doanh thu");
    }
  };

  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );
  const getVietnameseOrderStatus = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "Chờ xử lý", color: "gold" };
      case "processing":
        return { text: "Đang xử lý", color: "blue" };
      case "shipped":
        return { text: "Đã gửi", color: "purple" };
      case "delivered":
        return { text: "Đã giao", color: "green" };
      case "completed":
        return { text: "Hoàn thành", color: "success" };
      case "cancelled":
        return { text: "Đã hủy", color: "red" };
      case "returned":
        return { text: "Đã trả hàng", color: "magenta" };
      default:
        return { text: "Không rõ", color: "default" };
    }
  };
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      render: (id: string) => <span>{id.slice(-6).toUpperCase()}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        const { text, color } = getVietnameseOrderStatus(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (value: number) =>
        value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
  ];

  return (
    <div className="p-6">
      <Title level={3}>📊 Tổng quan hệ thống</Title>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic title="Người dùng" value={stats.users || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Sản phẩm" value={stats.products || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Đơn hàng" value={stats.orders || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue}
              precision={0}
              suffix="VND"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <div className="flex justify-between items-center">
                <span>
                  📈 Doanh thu theo{" "}
                  {filterType === "date"
                    ? "ngày"
                    : filterType === "month"
                    ? "tháng"
                    : "năm"}
                </span>
                <div className="flex gap-2">
                  <Select
                    value={filterType}
                    onChange={(value) => setFilterType(value)}
                    style={{ width: 100 }}
                  >
                    <Option value="date">Ngày</Option>
                    <Option value="month">Tháng</Option>
                    <Option value="year">Năm</Option>
                  </Select>

                  <DatePicker
                    picker={filterType}
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    allowClear={false}
                    format={
                      filterType === "date"
                        ? "DD/MM/YYYY"
                        : filterType === "month"
                        ? "MM/YYYY"
                        : "YYYY"
                    }
                  />
                </div>
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    filterType === "year"
                      ? "month"
                      : filterType === "month"
                      ? "day"
                      : "hour"
                  }
                />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#1890ff" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="📦 Đơn hàng gần đây">
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
