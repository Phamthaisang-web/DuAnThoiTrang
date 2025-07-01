"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Category {
  _id: string;
  name: string;
  description: string;
  parent?: Category | null;
  createdAt: string;
  updatedAt: string;
}

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens } = useAuthStore();
  const [form] = Form.useForm();

  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    totalRecord: 0,
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    }
  }, [tokens, navigate]);

  useEffect(() => {
    if (tokens?.accessToken) {
      fetchCategories();
    }
  }, [tokens?.accessToken, pagination.page, pagination.limit]);

  const fetchCategories = async (search = searchTerm) => {
    if (!tokens?.accessToken) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/categories", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { name: search } : {}),
        },
      });

      setCategories(res.data.data.categories);
      setPagination(res.data.data.pagination);
    } catch {
      message.error("Lỗi khi lấy danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/categories", {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        params: { limit: 1000 },
      });
      setParentCategories(res.data.data.categories);
    } catch {
      message.error("Lỗi khi tải danh mục cha");
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    form.resetFields();
    fetchParentCategories();
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      parent: category.parent?._id || null,
    });
    fetchParentCategories();
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này?",
      okType: "danger",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/v1/categories/${id}`, {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          });
          message.success("Xóa danh mục thành công");
          fetchCategories();
        } catch {
          message.error("Lỗi khi xóa danh mục");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (selectedCategory) {
        console.log("TOKEN in OrdersPage", tokens?.accessToken);
        await axios.put(
          `http://localhost:8080/api/v1/categories/${selectedCategory._id}`,
          values,
          {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          }
        );
        message.success("Cập nhật danh mục thành công");
      } else {
        await axios.post("http://localhost:8080/api/v1/categories", values, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        });
        message.success("Tạo mới danh mục thành công");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch {
      message.error("Lỗi khi xử lý danh mục");
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination({ ...pagination, page: 1 });
    fetchCategories(value);
  };

  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Danh Mục Cha",
      dataIndex: "parent",
      key: "parent",
      width: 200,
      render: (parent: Category | null) => parent?.name || "--",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 150,
      render: (_: any, record: Category) => (
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
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          <AppstoreOutlined /> Quản Lý Danh Mục
        </Title>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          Thêm Mới
        </Button>
      </div>

      <div className="mb-4">
        <Search
          placeholder="Tìm kiếm danh mục"
          onSearch={handleSearch}
          enterButton
          allowClear
          className="w-80"
        />
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalRecord,
          showSizeChanger: true,
        }}
        onChange={(p) =>
          setPagination({ ...pagination, page: p.current!, limit: p.pageSize! })
        }
      />

      <Modal
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saving}
        title={selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="parent" label="Danh mục cha">
            <Select allowClear placeholder="-- Không có --">
              {parentCategories
                .filter(
                  (cat) =>
                    cat.parent === null &&
                    (!selectedCategory || cat._id !== selectedCategory._id)
                )
                .map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
