"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Typography,
  Spin,
  Upload,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { UploadFile } from "antd/es/upload/interface";

const { Title } = Typography;
const { TextArea } = Input;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  images: { url: string; altText?: string }[];
  category?: { _id: string; name: string }[];
  brand?: { _id: string; name: string };
  sizes?: string[];
  colors?: string[];
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens } = useAuthStore();
  const [form] = Form.useForm();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      fetchProducts();
      fetchCategories();
      fetchBrands();
    }
  }, [tokens]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/products", {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setProducts(res.data.data.products || []);
    } catch {
      message.error("Lỗi khi lấy danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/categories", {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setCategories(res.data.data.categories);
    } catch {
      message.error("Lỗi khi lấy danh mục");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/brands", {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setBrands(res.data.data.brand);
    } catch {
      message.error("Lỗi khi lấy thương hiệu");
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setSelectedProduct(null);
    setUploadedImages([]);
    setSelectedSizes([]);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    const sizes = product.sizes || [];
    setSelectedSizes(sizes);
    form.setFieldsValue({
      ...product,
      category: product.category?.map((cat) => cat._id) || [],
      brand: product.brand?._id,
      sizes,
      colors: product.colors || [],
    });
    setUploadedImages(
      product.images.map((img, index) => ({
        uid: `${index}`,
        name: img.altText || `image-${index + 1}.jpg`,
        status: "done",
        url: `http://localhost:8080${img.url}`,
        response: { url: img.url },
      }))
    );
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okType: "danger",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/v1/products/${id}`, {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          });
          message.success("Xóa sản phẩm thành công");
          fetchProducts();
        } catch {
          message.error("Lỗi khi xóa sản phẩm");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const images = uploadedImages
        .filter(
          (file) => file.status === "done" && (file.response?.url || file.url)
        )
        .map((file) => ({
          url: file.response?.url || file.url,
          altText: file.name,
        }));

      if (images.length === 0) {
        message.error("Vui lòng tải lên ít nhất một ảnh");
        return;
      }

      const payload = {
        ...values,
        images,
        sizes: selectedSizes,
        colors: values.colors || [],
        category: values.category || [],
      };
      console.log("🟢 Categories gửi lên:", values.categories);
      console.log("🟢 Payload đang gửi lên server:", payload);

      setSaving(true);

      if (selectedProduct) {
        await axios.put(
          `http://localhost:8080/api/v1/products/${selectedProduct._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          }
        );
        message.success("Cập nhật sản phẩm thành công");
      } else {
        await axios.post("http://localhost:8080/api/v1/products", payload, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        });
        message.success("Tạo sản phẩm mới thành công");
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("🛑 Lỗi từ server:", err?.response?.data || err.message);
      message.error(err?.response?.data?.message || "Lỗi khi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "image",
      render: (_: any, record: Product) =>
        record.images?.[0]?.url ? (
          <img
            src={`http://localhost:8080${record.images[0].url}`}
            alt={record.name}
            style={{
              width: 50,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <span>Không có ảnh</span>
        ),
    },
    { title: "Tên Sản Phẩm", dataIndex: "name", key: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `${value.toLocaleString()}₫`,
    },
    // ✅ Thêm cột "Kích cỡ"
    {
      title: "Kích cỡ",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes: string[]) =>
        sizes && sizes.length > 0 ? sizes.join(", ") : "—",
    },

    // ✅ Thêm cột "Màu sắc"
    {
      title: "Màu sắc",
      dataIndex: "colors",
      key: "colors",
      render: (colors: string[]) =>
        colors && colors.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {colors.map((color, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: color,

                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 12,
                  textTransform: "capitalize",
                }}
              >
                {color}
              </span>
            ))}
          </div>
        ) : (
          "—"
        ),
    },

    { title: "Tồn kho", dataIndex: "stockQuantity", key: "stockQuantity" },
    {
      title: "Danh Mục",
      dataIndex: "category",
      key: "category",
      render: (categories: Category[] = []) =>
        categories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
              >
                {cat.name}
              </span>
            ))}
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Thương Hiệu",
      dataIndex: ["brand", "name"],
      key: "brand",
      render: (_: any, record: any) => record?.brand?.name || "—",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Product) => (
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

  if (!tokens?.accessToken) return <Spin fullscreen />;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          <AppstoreOutlined /> Quản Lý Sản Phẩm
        </Title>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          Thêm Mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saving}
        title={selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true }]}
          >
            <InputNumber<number>
              min={0}
              className="w-full"
              formatter={(value) =>
                value
                  ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫"
                  : ""
              }
              parser={(value) =>
                value
                  ? parseInt(
                      value.replace(/[₫.]/g, "").replace(/[^0-9]/g, ""),
                      10
                    )
                  : 0
              }
            />
          </Form.Item>
          <Form.Item
            name="stockQuantity"
            label="Số lượng tồn"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item label="Ảnh sản phẩm">
            <Upload
              name="file"
              listType="picture-card"
              multiple
              action="http://localhost:8080/api/v1/upload"
              headers={{ Authorization: `Bearer ${tokens?.accessToken || ""}` }}
              fileList={uploadedImages}
              onChange={({ file, fileList }) => {
                setUploadedImages(fileList);
                if (file.status === "done")
                  message.success("Tải ảnh thành công");
                if (file.status === "error") message.error("Tải ảnh thất bại");
              }}
              onRemove={(file) => {
                setUploadedImages((prev) =>
                  prev.filter((f) => f.uid !== file.uid)
                );
              }}
            >
              {uploadedImages.length < 8 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item name="category" label="Danh mục">
            <Select
              mode="multiple"
              placeholder="Chọn danh mục"
              allowClear
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              }))}
            />
          </Form.Item>
          <Form.Item name="brand" label="Thương hiệu">
            <Select
              placeholder="Chọn thương hiệu"
              allowClear
              options={brands.map((b) => ({ label: b.name, value: b._id }))}
            />
          </Form.Item>

          <Form.Item name="sizes" label="Kích cỡ">
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      const newSizes = isSelected
                        ? selectedSizes.filter((s) => s !== size)
                        : [...selectedSizes, size];
                      setSelectedSizes(newSizes);
                      form.setFieldValue("sizes", newSizes);
                    }}
                    className={`px-4 py-2 rounded-lg border font-semibold transition-all duration-200
                      ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </Form.Item>

          <Form.Item name="colors" label="Màu sắc">
            <Select mode="tags" placeholder="Nhập các màu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
