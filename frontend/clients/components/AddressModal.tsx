"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { X, MapPin, User, Phone, Home, Star, Save } from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

type Province = { code: number; name: string };
type District = { code: number; name: string };
type Ward = { code: number; name: string };

type Address = {
  _id: string;
  receiverName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
};

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressAdded: () => void;
  editingAddress?: Address | null;
}

export default function AddressModal({
  isOpen,
  onClose,
  onAddressAdded,
  editingAddress,
}: AddressModalProps) {
  const { tokens } = useAuthStore();
  const accessToken = tokens?.accessToken;

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [formData, setFormData] = useState({
    receiverName: "",
    phone: "",
    addressLine: "",
    city: "",
    district: "",
    ward: "",
    isDefault: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isEditing = !!editingAddress;

  useEffect(() => {
    if (isOpen) {
      fetch("https://open.oapi.vn/location/provinces?page=0&size=100")
        .then((res) => res.json())
        .then((data) => setProvinces(data.data || []));
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingAddress && isOpen) {
      const province = provinces.find((p) => p.name === editingAddress.city);
      const district = districts.find(
        (d) => d.name === editingAddress.district
      );
      const ward = wards.find((w) => w.name === editingAddress.ward);

      setFormData({
        receiverName: editingAddress.receiverName,
        phone: editingAddress.phone,
        addressLine: editingAddress.addressLine,
        city: province?.code?.toString() || "",
        district: district?.code?.toString() || "",
        ward: ward?.code?.toString() || "",
        isDefault: editingAddress.isDefault,
      });
    }
  }, [editingAddress, isOpen, provinces, districts, wards]);

  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const code = e.target.value;
    setFormData((prev) => ({ ...prev, city: code, district: "", ward: "" }));
    const res = await fetch(
      `https://open.oapi.vn/location/districts?page=0&size=100&provinceCode=${code}`
    );
    const data = await res.json();
    setDistricts(data.data || []);
    setWards([]);
  };

  const handleDistrictChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const code = e.target.value;
    setFormData((prev) => ({ ...prev, district: code, ward: "" }));
    const res = await fetch(
      `https://open.oapi.vn/location/wards?page=0&size=100&districtCode=${code}`
    );
    const data = await res.json();
    setWards(data.data || []);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setFormData((prev) => ({ ...prev, ward: code }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!accessToken) {
      setMessage("Bạn cần đăng nhập để thực hiện thao tác này.");
      setLoading(false);
      return;
    }

    const selectedProvince = provinces.find(
      (p) => String(p.code) === formData.city
    );
    const selectedDistrict = districts.find(
      (d) => String(d.code) === formData.district
    );
    const selectedWard = wards.find((w) => String(w.code) === formData.ward);

    const payload = {
      ...formData,
      city: selectedProvince?.name || "",
      district: selectedDistrict?.name || "",
      ward: selectedWard?.name || "",
    };

    try {
      const url = isEditing
        ? `${apiUrl}/api/v1/addresses/${editingAddress!._id}`
        : `${apiUrl}/api/v1/addresses`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra.");

      toast.success(`${isEditing ? "Cập nhật" : "Thêm"} địa chỉ thành công`);
      onAddressAdded();
      handleClose();
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      receiverName: "",
      phone: "",
      addressLine: "",
      city: "",
      district: "",
      ward: "",
      isDefault: false,
    });
    setDistricts([]);
    setWards([]);
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-md w-full max-w-md max-h-[90vh] overflow-auto p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4 mr-2" />
            {isEditing ? "Sửa địa chỉ" : "Thêm địa chỉ"}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <InputField
            icon={<User className="w-4 h-4" />}
            id="receiverName"
            label="Tên người nhận"
            value={formData.receiverName}
            onChange={handleChange}
          />
          <InputField
            icon={<Phone className="w-4 h-4" />}
            id="phone"
            label="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />
          <InputField
            icon={<Home className="w-4 h-4" />}
            id="addressLine"
            label="Địa chỉ"
            value={formData.addressLine}
            onChange={handleChange}
          />

          <SelectField
            label="Tỉnh/Thành phố"
            value={formData.city}
            onChange={handleProvinceChange}
            options={provinces}
          />
          <SelectField
            label="Quận/Huyện"
            value={formData.district}
            onChange={handleDistrictChange}
            options={districts}
            disabled={!districts.length}
          />
          <SelectField
            label="Phường/Xã"
            value={formData.ward}
            onChange={handleWardChange}
            options={wards}
            disabled={!wards.length}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label
              htmlFor="isDefault"
              className="flex items-center text-sm text-gray-700"
            >
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              Địa chỉ mặc định
            </label>
          </div>

          {message && <p className="text-red-500 text-sm">{message}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 rounded-md text-white flex items-center justify-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-slate-700 hover:bg-slate-800"
              }`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Cập nhật" : "Lưu"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({ icon, id, label, value, onChange }: any) {
  return (
    <div>
      <label htmlFor={id} className="text-gray-600 text-xs font-medium">
        {label}
      </label>
      <div className="relative mt-1">
        <div className="absolute left-2 top-2.5 text-gray-400">{icon}</div>
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required
          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm"
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, disabled }: any) {
  return (
    <div>
      <label className="text-gray-600 text-xs font-medium">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm bg-white disabled:bg-gray-100"
      >
        <option value="">Chọn {label}</option>
        {options.map((opt: any, index: number) => (
          <option key={opt.code || index} value={opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
