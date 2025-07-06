"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
  Typography,
  Spin,
  Checkbox,
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
import { env } from "../constants/getEnvs";

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
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);

  // State for filters
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [stockStatus, setStockStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập");
      navigate("/login");
    } else {
      fetchData();
    }
  }, [tokens]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        axios.get(`${env.API_URL}/api/v1/products`, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        }),
        axios.get(`${env.API_URL}/api/v1/categories`, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        }),
        axios.get(`${env.API_URL}/api/v1/brands`, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        }),
      ]);

      setProducts(productsRes.data.data.products || []);
      setCategories(categoriesRes.data.data.categories || []);
      setBrands(brandsRes.data.data.brand || []);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setUploadedImages([]);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    form.setFieldsValue({
      ...product,
      category: product.category?.map((cat) => cat._id) || [],
      brand: product.brand?._id,
      sizes: product.sizes || [],
      colors: product.colors || [],
    });

    setUploadedImages(
      product.images?.map((img, index) => ({
        uid: `-${index}`,
        name: img.altText || `image-${index}`,
        status: "done",
        url: `${env.API_URL}${img.url}`,
        response: { url: img.url },
      })) || []
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
          await axios.delete(`${env.API_URL}/api/v1/products/${id}`, {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          });
          message.success("Xóa sản phẩm thành công");
          fetchData();
        } catch {
          message.error("Lỗi khi xóa sản phẩm");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (uploadedImages.length === 0) {
        message.error("Vui lòng tải lên ít nhất một ảnh sản phẩm");
        return;
      }

      const images = uploadedImages.map((img) => ({
        url: img.response?.url || img.url?.replace(env.API_URL, ""),
        altText: img.name,
      }));

      const payload = {
        ...values,
        images,
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
      };

      setSaving(true);

      if (values._id) {
        await axios.put(
          `${env.API_URL}/api/v1/products/${values._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          }
        );
        message.success("Cập nhật sản phẩm thành công");
      } else {
        await axios.post(`${env.API_URL}/api/v1/products`, payload, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        });
        message.success("Thêm sản phẩm mới thành công");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      message.error("Lỗi khi lưu sản phẩm");
    } finally {
      setSaving(false);
    }
  };
  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    // Khi selectedCategory là null (chọn "Tất cả"), sẽ không lọc theo category
    const matchesCategory =
      selectedCategory === null ||
      product.category?.some((cat) => cat._id === selectedCategory);

    // Khi selectedBrand là null (chọn "Tất cả"), sẽ không lọc theo brand
    const matchesBrand =
      selectedBrand === null || product.brand?._id === selectedBrand;

    // Khi stockStatus là null (chọn "Tất cả"), sẽ không lọc theo stock
    const matchesStock =
      stockStatus === null ||
      (stockStatus === "in-stock" && product.stockQuantity > 0) ||
      (stockStatus === "out-of-stock" && product.stockQuantity === 0);

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "image",
      render: (_: any, record: Product) =>
        record.images?.[0]?.url ? (
          <img
            src={`${env.API_URL}${record.images[0].url}`}
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
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      render: (text: string) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: 200,
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `${value.toLocaleString()}₫`,
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: "Kích cỡ",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes: string[]) =>
        sizes && sizes.length > 0 ? (
          <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              maxWidth: 150,
            }}
          >
            {sizes.join(", ")}
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Màu sắc",
      dataIndex: "colors",
      key: "colors",
      render: (colors: string[]) =>
        colors && colors.length > 0 ? (
          <div className="flex flex-wrap gap-1 max-w-[200px] break-words">
            {colors.map((color, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: color,
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 12,
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
          <div className="flex flex-wrap gap-1 max-w-[150px] break-words">
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
      render: (_: any, record: Product) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            maxWidth: 150,
          }}
        >
          {record?.brand?.name || "—"}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
      sorter: (a: Product, b: Product) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
          <AppstoreOutlined /> Quản lý sản phẩm
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      {/* Filter section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />

        <div className="flex flex-wrap gap-2">
          <Select
            placeholder="Danh mục"
            allowClear
            style={{ width: 180 }}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
            options={[
              { label: "Tất cả danh mục", value: null }, // Thêm option "Tất cả"
              ...categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              })),
            ]}
          />

          <Select
            placeholder="Thương hiệu"
            allowClear
            style={{ width: 180 }}
            value={selectedBrand}
            onChange={(value) => setSelectedBrand(value)}
            options={[
              { label: "Tất cả thương hiệu", value: null }, // Thêm option "Tất cả"
              ...brands.map((brand) => ({
                label: brand.name,
                value: brand._id,
              })),
            ]}
          />

          <Select
            placeholder="Tình trạng kho"
            allowClear
            style={{ width: 150 }}
            value={stockStatus}
            onChange={(value) => setStockStatus(value)}
            options={[
              { label: "Tất cả", value: null }, // Thêm option "Tất cả"
              { label: "Còn hàng", value: "in-stock" },
              { label: "Hết hàng", value: "out-of-stock" },
            ]}
          />
        </div>
      </div>

      {/* Product table */}
      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
      />

      {/* Product form modal */}
      <Modal
        title={
          form.getFieldValue("_id") ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"
        }
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saving}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price"
              label="Giá (VND)"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="stockQuantity"
              label="Số lượng tồn kho"
              rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>

          <Form.Item name="sizes" label="Kích cỡ">
            <Checkbox.Group
              options={["XS", "S", "M", "L", "XL"]}
              className="flex gap-4 flex-wrap"
            />
          </Form.Item>

          <Form.Item name="colors" label="Màu sắc">
            <Select
              mode="tags"
              tokenSeparators={[","]}
              placeholder="Nhập màu"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select
                mode="multiple"
                options={categories.map((cat) => ({
                  label: cat.name,
                  value: cat._id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="brand"
              label="Thương hiệu"
              rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
            >
              <Select
                options={brands.map((brand) => ({
                  label: brand.name,
                  value: brand._id,
                }))}
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Ảnh sản phẩm"
            required
            rules={[
              { required: true, message: "Vui lòng tải lên ít nhất một ảnh" },
            ]}
          >
            <Upload
              name="file"
              listType="picture-card"
              action={`${env.API_URL}/api/v1/upload`}
              headers={{ Authorization: `Bearer ${tokens?.accessToken || ""}` }}
              fileList={uploadedImages}
              onChange={({ file, fileList }) => {
                setUploadedImages(fileList);
                if (file.status === "done") {
                  message.success("Tải ảnh thành công");
                } else if (file.status === "error") {
                  message.error("Tải ảnh thất bại");
                }
              }}
              onRemove={(file) => {
                setUploadedImages((prev) =>
                  prev.filter((f) => f.uid !== file.uid)
                );
              }}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("Chỉ được tải lên file ảnh!");
                  return Upload.LIST_IGNORE;
                }
                return isImage;
              }}
              multiple
              maxCount={5}
              accept="image/*"
            >
              {uploadedImages.length < 5 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductPage;
