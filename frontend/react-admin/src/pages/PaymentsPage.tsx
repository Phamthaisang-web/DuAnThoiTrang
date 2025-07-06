"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  message,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import dayjs from "dayjs";
import { env } from "../constants/getEnvs";
import type { UploadFile } from "antd/es/upload/interface";
const { Title } = Typography;

interface Payment {
  _id: string;
  order: string;
  paymentDate: string;
  amount: number;
  method: string;
}

interface Order {
  _id: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens } = useAuthStore();
  const [form] = Form.useForm();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      fetchPayments();
      fetchOrders();
    }
  }, [tokens]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${env.API_URL}/api/v1/payments`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setPayments(res.data.data.payments);
    } catch {
      message.error("Lỗi khi lấy danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${env.API_URL}/api/v1/orders`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setOrders(res.data.data.orders);
    } catch {
      message.error("Lỗi khi lấy danh sách đơn hàng");
    }
  };

  const handleEdit = (payment: Payment) => {
    form.setFieldsValue({
      ...payment,
      paymentDate: dayjs(payment.paymentDate),
    });
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xóa thanh toán?",
      content: "Bạn có chắc chắn muốn xóa giao dịch này?",
      okType: "danger",
      onOk: async () => {
        try {
          await axios.delete(`${env.API_URL}/api/v1/payments/${id}`, {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          });
          message.success("Xóa thành công");
          fetchPayments();
        } catch {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.paymentDate = values.paymentDate.toISOString();
      setSaving(true);

      if (selectedPayment) {
        // Cập nhật
        await axios.put(
          `${env.API_URL}/api/v1/payments/${selectedPayment._id}`,
          values,
          {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          }
        );
        message.success("Cập nhật thành công");
      } else {
        // Thêm mới
        await axios.post(`${env.API_URL}/api/v1/payments`, values, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        });
        message.success("Thêm mới thành công");
      }

      setIsModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi lưu thanh toán");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      render: (method: string) =>
        method === "cash"
          ? "Tiền mặt"
          : method === "bank_transfer"
          ? "Chuyển khoản"
          : method,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Payment) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          <CreditCardOutlined /> Quản Lý Thanh Toán
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedPayment(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Thêm thanh toán
        </Button>
      </div>

      <Table
        rowKey="_id"
        loading={loading}
        dataSource={payments}
        columns={columns}
        pagination={false}
      />

      <Modal
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saving}
        title={selectedPayment ? "Chỉnh sửa thanh toán" : "Thêm mới thanh toán"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="order"
            label="Mã đơn hàng"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Chọn đơn hàng"
              disabled={!!selectedPayment}
              options={orders.map((o) => ({ label: o._id, value: o._id }))}
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            name="paymentDate"
            label="Ngày thanh toán"
            rules={[{ required: true }]}
          >
            <DatePicker showTime className="w-full" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Số tiền"
            rules={[{ required: true, type: "number", min: 0 }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item
            name="method"
            label="Phương thức thanh toán"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: "Tiền mặt", value: "cash" },
                { label: "Chuyển khoản", value: "bank_transfer" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentPage;
