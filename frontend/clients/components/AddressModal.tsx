"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { X, MapPin, User, Phone, Home, Star, Save } from "lucide-react";

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
      fetch("https://provinces.open-api.vn/api/p/")
        .then((res) => res.json())
        .then((data) => setProvinces(data));
    }
  }, [isOpen]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingAddress && isOpen) {
      setFormData({
        receiverName: editingAddress.receiverName,
        phone: editingAddress.phone,
        addressLine: editingAddress.addressLine,
        city: editingAddress.city,
        district: editingAddress.district,
        ward: editingAddress.ward,
        isDefault: editingAddress.isDefault,
      });

      // Load districts and wards for the selected province
      const loadLocationData = async () => {
        try {
          // Find province by name
          const province = provinces.find(
            (p) => p.name === editingAddress.city
          );
          if (province) {
            const res = await fetch(
              `https://provinces.open-api.vn/api/p/${province.code}?depth=2`
            );
            const data = await res.json();
            setDistricts(data.districts || []);

            // Find district by name
            const district = data.districts?.find(
              (d: District) => d.name === editingAddress.district
            );
            if (district) {
              const districtRes = await fetch(
                `https://provinces.open-api.vn/api/d/${district.code}?depth=2`
              );
              const districtData = await districtRes.json();
              setWards(districtData.wards || []);
            }
          }
        } catch (error) {
          console.error("Error loading location data:", error);
        }
      };

      if (provinces.length > 0) {
        loadLocationData();
      }
    }
  }, [editingAddress, isOpen, provinces]);

  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const code = e.target.value;
    const province = provinces.find((p) => p.code.toString() === code);
    setFormData({
      ...formData,
      city: province?.name || "",
      district: "",
      ward: "",
    });

    const res = await fetch(
      `https://provinces.open-api.vn/api/p/${code}?depth=2`
    );
    const data = await res.json();
    setDistricts(data.districts || []);
    setWards([]);
  };

  const handleDistrictChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const code = e.target.value;
    const district = districts.find((d) => d.code.toString() === code);
    setFormData({
      ...formData,
      district: district?.name || "",
      ward: "",
    });

    const res = await fetch(
      `https://provinces.open-api.vn/api/d/${code}?depth=2`
    );
    const data = await res.json();
    setWards(data.wards || []);
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ward = wards.find((w) => w.code.toString() === e.target.value);
    setFormData({
      ...formData,
      ward: ward?.name || "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

    try {
      const url = isEditing
        ? `http://localhost:8080/api/v1/addresses/${editingAddress!._id}`
        : "http://localhost:8080/api/v1/addresses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.message || `Lỗi ${isEditing ? "cập nhật" : "tạo"} địa chỉ.`
        );

      toast.success(`${isEditing ? "Cập nhật" : "Tạo"} địa chỉ thành công!`);

      // Reset form
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

      // Notify parent component to refresh addresses
      onAddressAdded();
      onClose();
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isEditing ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
                </h2>
                <p className="text-slate-200 text-sm">
                  Cập nhật thông tin giao hàng
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Receiver Name */}
            <div className="space-y-2">
              <label
                htmlFor="receiverName"
                className="block text-sm font-medium text-gray-700"
              >
                Tên người nhận
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="receiverName"
                  name="receiverName"
                  placeholder="Nhập tên người nhận"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Address Line */}
            <div className="space-y-2">
              <label
                htmlFor="addressLine"
                className="block text-sm font-medium text-gray-700"
              >
                Địa chỉ chi tiết
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="addressLine"
                  name="addressLine"
                  placeholder="Số nhà, ngõ, đường..."
                  value={formData.addressLine}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Location Selects */}
            <div className="grid grid-cols-1 gap-4">
              {/* Province */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tỉnh / Thành phố
                </label>
                <select
                  onChange={handleProvinceChange}
                  value={
                    provinces.find((p) => p.name === formData.city)?.code || ""
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all bg-white"
                  required
                >
                  <option value="">Chọn Tỉnh / Thành phố</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quận / Huyện
                </label>
                <select
                  onChange={handleDistrictChange}
                  value={
                    districts.find((d) => d.name === formData.district)?.code ||
                    ""
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  required
                  disabled={!districts.length}
                >
                  <option value="">Chọn Quận / Huyện</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phường / Xã
                </label>
                <select
                  onChange={handleWardChange}
                  value={
                    wards.find((w) => w.name === formData.ward)?.code || ""
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  required
                  disabled={!wards.length}
                >
                  <option value="">Chọn Phường / Xã</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500 focus:ring-2"
              />
              <label
                htmlFor="isDefault"
                className="ml-3 flex items-center text-sm font-medium text-amber-800"
              >
                <Star className="w-4 h-4 mr-2 text-amber-500" />
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            {/* Error Message */}
            {message && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-600">{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-slate-800 to-gray-900 hover:from-slate-900 hover:to-black shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Cập nhật" : "Lưu địa chỉ"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
