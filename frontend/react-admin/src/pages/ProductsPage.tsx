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
  message,
  Typography,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { UploadFile } from "antd/es/upload/interface";
import { env } from "../constants/getEnvs";

const { Title } = Typography;

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadFile[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    string | null
  >(null);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(
    null
  );
  const [selectedStockFilter, setSelectedStockFilter] = useState<string | null>(
    null
  );

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
      const res = await axios.get(`${env.API_URL}/api/v1/products`, {
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
      const res = await axios.get(`${env.API_URL}/api/v1/categories`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setCategories(res.data.data.categories);
    } catch {
      message.error("Lỗi khi lấy danh mục");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get(`${env.API_URL}/api/v1/brands`, {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      });
      setBrands(res.data.data.brand);
    } catch {
      message.error("Lỗi khi lấy thương hiệu");
    }
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
        url: `${env.API_URL}${img.url}`,
        response: { url: img.url },
      }))
    );
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
          fetchProducts();
        } catch {
          message.error("Lỗi khi xóa sản phẩm");
        }
      },
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      !selectedCategoryFilter ||
      product.category?.some((cat) => cat._id === selectedCategoryFilter);

    const matchesBrand =
      !selectedBrandFilter || product.brand?._id === selectedBrandFilter;

    const matchesStock =
      !selectedStockFilter ||
      (selectedStockFilter === "available" && product.stockQuantity > 0) ||
      (selectedStockFilter === "out-of-stock" && product.stockQuantity === 0);

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
        sizes && sizes.length > 0 ? sizes.join(", ") : "—",
    },
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
      render: (_: any, record: Product) => record?.brand?.name || "—",
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
          <AppstoreOutlined /> Quản Lý Sản Phẩm
        </Title>
        <Button icon={<PlusOutlined />} type="primary">
          Thêm Mới
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <Input.Search
          placeholder="Tìm theo tên sản phẩm"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 280 }}
        />

        <div className="flex gap-2 flex-wrap">
          <Select
            placeholder="Tất cả danh mục"
            allowClear
            style={{ width: 180 }}
            value={selectedCategoryFilter || undefined}
            onChange={(value) => setSelectedCategoryFilter(value || null)}
            options={[
              { label: "Tất cả", value: null },
              ...categories.map((cat) => ({
                label: cat.name,
                value: cat._id,
              })),
            ]}
          />

          <Select
            placeholder="Tất cả thương hiệu"
            allowClear
            style={{ width: 180 }}
            value={selectedBrandFilter || undefined}
            onChange={(value) => setSelectedBrandFilter(value || null)}
            options={[
              { label: "Tất cả", value: null },
              ...brands.map((brand) => ({
                label: brand.name,
                value: brand._id,
              })),
            ]}
          />

          <Select
            placeholder="Lọc theo tồn kho"
            allowClear
            style={{ width: 160 }}
            value={selectedStockFilter || undefined}
            onChange={(value) => setSelectedStockFilter(value || null)}
            options={[
              { label: "Còn hàng", value: "available" },
              { label: "Hết hàng", value: "out-of-stock" },
            ]}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ProductPage;
