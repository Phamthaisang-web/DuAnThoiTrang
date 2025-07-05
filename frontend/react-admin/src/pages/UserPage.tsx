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
  const { tokens, user } = useAuthStore(); // ✅ Lấy user đúng cách
  const [form] = Form.useForm();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUserId = user?._id;

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [tokens]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${env.API_URL}/api/v1/users`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });

      const allUsers = res.data.data.users;

      // ✅ Loại bỏ chính mình khỏi danh sách
      const filteredUsers = allUsers.filter(
        (u: User) => u._id !== currentUserId
      );

      setUsers(filteredUsers);
    } catch (err) {
      message.error("Lỗi khi lấy danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      await axios.post(`${env.API_URL}/api/v1/users`, values, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      message.success("Tạo người dùng mới thành công");

      setIsModalOpen(false);
      fetchUsers();
    } catch {
      message.error("Lỗi khi lưu người dùng");
    } finally {
      setSaving(false);
    }
  };

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

      <Modal
        open={isModalOpen}
        title="Thêm người dùng"
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true }]}
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
    </div>
  );
};

export default UserPage;
