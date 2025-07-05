import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Typography,
  Space,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useAuthStore } from "../stores/useAuthStore";
import { env } from "../constants/getEnvs";

const { Title } = Typography;
const { Option } = Select;

interface Promotion {
  _id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  maxDiscount?: number;
  quantity?: number; // ✅ Thêm số lượng
  isActive: boolean;
  expiredAt: string;
  description?: string;
  createdAt: string;
}

const PromotionPage: React.FC = () => {
  const { tokens } = useAuthStore();
  const [form] = Form.useForm();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${env.API_URL}/api/v1/promotions`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      });
      setPromotions(res.data.data.promotions);
    } catch {
      message.error("Lỗi khi tải danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAdd = () => {
    setEditingPromo(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    form.setFieldsValue({
      ...promo,
      expiredAt: dayjs(promo.expiredAt),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa phiếu giảm giá này?",
      okType: "danger",
      onOk: async () => {
        try {
          await axios.delete(`${env.API_URL}/api/v1/promotions/${id}`, {
            headers: {
              Authorization: `Bearer ${tokens?.accessToken}`,
            },
          });
          message.success("Đã xóa phiếu giảm giá");
          fetchPromotions();
        } catch {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        expiredAt: values.expiredAt.toISOString(),
      };
      setSaving(true);
      if (editingPromo) {
        await axios.put(
          `${env.API_URL}/api/v1/promotions/${editingPromo._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${tokens?.accessToken}`,
            },
          }
        );
        message.success("Cập nhật thành công");
      } else {
        await axios.post(`${env.API_URL}/api/v1/promotions`, payload, {
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
        });
        message.success("Tạo phiếu giảm giá thành công");
      }
      setIsModalOpen(false);
      fetchPromotions();
    } catch {
      message.error("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (type === "percent" ? "Phần trăm" : "Cố định"),
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (_: any, record: Promotion) =>
        record.type === "percent"
          ? `${record.value}%`
          : `${record.value.toLocaleString()}₫`,
    },
    {
      title: "Tối đa",
      dataIndex: "maxDiscount",
      key: "maxDiscount",
      render: (val?: number) => (val ? `${val.toLocaleString()}₫` : "--"),
    },
    {
      title: "Số lượng", // ✅ Thêm cột số lượng
      dataIndex: "quantity",
      key: "quantity",
      render: (val?: number) => (val !== undefined ? val : "--"),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiredAt",
      key: "expiredAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (active: boolean) => (active ? "Đang hoạt động" : "Tạm ngưng"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Promotion) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
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
          <PercentageOutlined /> Quản Lý Phiếu Giảm Giá
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Phiếu
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={promotions}
        rowKey="_id"
        loading={loading}
        bordered
      />

      <Modal
        title={editingPromo ? "Cập nhật phiếu giảm giá" : "Tạo phiếu giảm giá"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saving}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Mã phiếu"
            name="code"
            rules={[{ required: true, message: "Nhập mã phiếu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Chọn loại giảm giá" }]}
          >
            <Select>
              <Option value="percent">Phần trăm</Option>
              <Option value="fixed">Giảm cố định</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Giá trị"
            name="value"
            rules={[{ required: true, message: "Nhập giá trị giảm" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item label="Giảm tối đa (tuỳ chọn)" name="maxDiscount">
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item label="Số lượng (tuỳ chọn)" name="quantity">
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item
            label="Ngày hết hạn"
            name="expiredAt"
            rules={[{ required: true, message: "Chọn ngày hết hạn" }]}
          >
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionPage;
