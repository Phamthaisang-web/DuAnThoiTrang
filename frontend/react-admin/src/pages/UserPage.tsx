"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  message,
  Switch,
} from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { env } from "../constants/getEnvs";

const { Title } = Typography;
const { Option } = Select;

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
}

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens, user } = useAuthStore();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const currentUserId = user?._id;

  // 🔹 Kiểm tra token
  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [tokens]);

  // 🔹 Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${env.API_URL}/api/v1/users`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      const allUsers = res.data.data.users;
      const filteredUsers = allUsers.filter(
        (u: User) => u._id !== currentUserId
      );
      setUsers(filteredUsers);
    } catch {
      message.error("Lỗi khi lấy danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Mở modal thêm người dùng
  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };
  // 🔹 Gửi OTP đến email
  const handleSendOtp = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // ✅ Gọi đúng API backend: /users/request-otp
      await axios.post(`${env.API_URL}/api/v1/users/request-otp`, {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
      });

      message.success("✅ Mã OTP đã được gửi đến email người dùng");
      setPendingUser(values);
      setOtpModalOpen(true);
    } catch (err: any) {
      console.error("Lỗi gửi OTP:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "❌ Không thể gửi OTP, vui lòng kiểm tra email hoặc API";
      message.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Xác minh OTP và tạo tài khoản
  const handleVerifyOtp = async () => {
    try {
      const { otp } = await otpForm.validateFields();
      setSaving(true);

      // ✅ Gọi đúng API backend: /users/verify-otp
      await axios.post(`${env.API_URL}/api/v1/users/verify-otp`, {
        ...pendingUser,
        otp,
      });

      message.success("🎉 Tài khoản đã được tạo thành công!");
      setOtpModalOpen(false);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Lỗi xác minh OTP:", err);
      message.error(err.response?.data?.message || "❌ Mã OTP không hợp lệ");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Bật/tắt trạng thái hoạt động
  const handleToggleActive = async (checked: boolean, user: User) => {
    if (user._id === currentUserId) {
      message.warning("Không thể thay đổi trạng thái chính mình");
      return;
    }

    try {
      await axios.put(
        `${env.API_URL}/api/v1/user/${user._id}`,
        { isActive: checked },
        {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        }
      );
      message.success("Cập nhật trạng thái thành công");
      fetchUsers();
    } catch {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const columns = [
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Vai trò", dataIndex: "role", key: "role" },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: any, record: User) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleToggleActive(checked, record)}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          <UserOutlined /> Quản Lý Người Dùng
        </Title>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          Thêm Người Dùng
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal nhập thông tin user */}
      <Modal
        open={isModalOpen}
        title="Thêm người dùng"
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSendOtp}
        confirmLoading={saving}
        okText="Gửi mã OTP"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal nhập mã OTP */}
      <Modal
        open={otpModalOpen}
        title="Nhập mã OTP để xác minh"
        onCancel={() => setOtpModalOpen(false)}
        onOk={handleVerifyOtp}
        confirmLoading={saving}
        okText="Xác minh OTP"
      >
        <Form form={otpForm} layout="vertical">
          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
          >
            <Input maxLength={6} placeholder="Nhập mã OTP 6 chữ số" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
