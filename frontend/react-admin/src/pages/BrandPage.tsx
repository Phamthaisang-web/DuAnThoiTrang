"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Upload,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  TrademarkOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/useAuthStore"
import type { UploadFile } from "antd/es/upload/interface"

const { Title } = Typography

interface Brand {
  _id: string
  name: string
  logo?: string
  country?: string
  slug: string
  createdAt: string
}

const BrandPage: React.FC = () => {
  const navigate = useNavigate()
  const { tokens } = useAuthStore()
  const [form] = Form.useForm()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [uploadedLogo, setUploadedLogo] = useState<UploadFile[]>([])

  useEffect(() => {
    if (!tokens?.accessToken) {
      message.warning("Vui lòng đăng nhập")
      navigate("/login")
    } else {
      fetchBrands()
    }
  }, [tokens])

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8080/api/v1/brands", {
        headers: { Authorization: `Bearer ${tokens!.accessToken}` },
      })
      setBrands(res.data.data.brand)
    } catch {
      message.error("Lỗi khi lấy danh sách thương hiệu")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    form.resetFields()
    setSelectedBrand(null)
    setUploadedLogo([])
    setIsModalOpen(true)
  }

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand)
    form.setFieldsValue(brand)
    if (brand.logo) {
      setUploadedLogo([
        {
          uid: "-1",
          name: "logo.jpg",
          status: "done",
          url: `http://localhost:8080${brand.logo}`,
          response: { url: brand.logo },
        },
      ])
    }
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thương hiệu này?",
      okType: "danger",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/v1/brands/${id}`, {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          })
          message.success("Xóa thương hiệu thành công")
          fetchBrands()
        } catch {
          message.error("Lỗi khi xóa thương hiệu")
        }
      },
    })
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const logo = uploadedLogo?.[0]?.response?.url

      const payload = {
        ...values,
        logo,
      }

      setSaving(true)

      if (selectedBrand) {
        await axios.put(
          `http://localhost:8080/api/v1/brands/${selectedBrand._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${tokens!.accessToken}` },
          }
        )
        message.success("Cập nhật thương hiệu thành công")
      } else {
        await axios.post("http://localhost:8080/api/v1/brands", payload, {
          headers: { Authorization: `Bearer ${tokens!.accessToken}` },
        })
        message.success("Tạo thương hiệu mới thành công")
      }

      setIsModalOpen(false)
      fetchBrands()
    } catch {
      message.error("Lỗi khi lưu thương hiệu")
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      render: (logo: string) =>
        logo ? (
          <img src={`http://localhost:8080${logo}`} alt="logo" style={{ width: 50 }} />
        ) : (
          "Không có"
        ),
    },
    { title: "Tên", dataIndex: "name", key: "name" },
    
    { title: "Quốc gia", dataIndex: "country", key: "country" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Brand) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>
          <TrademarkOutlined /> Quản lý thương hiệu
        </Title>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      <Table columns={columns} dataSource={brands} rowKey="_id" loading={loading} />

      <Modal
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saving}
        title={selectedBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên thương hiệu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          
          <Form.Item name="country" label="Quốc gia">
            <Input />
          </Form.Item>

          <Form.Item label="Logo">
            <Upload
              name="file"
              listType="picture-card"
              action="http://localhost:8080/api/v1/upload"
              headers={{ Authorization: `Bearer ${tokens?.accessToken || ""}` }}
              fileList={uploadedLogo}
              onChange={({ file, fileList }) => {
                setUploadedLogo(fileList)
                if (file.status === "done") message.success("Tải ảnh thành công")
                if (file.status === "error") message.error("Tải ảnh thất bại")
              }}
              onRemove={(file) => {
                setUploadedLogo((prev) => prev.filter((f) => f.uid !== file.uid))
              }}
              maxCount={1}
            >
              {uploadedLogo.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Tải logo</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BrandPage
