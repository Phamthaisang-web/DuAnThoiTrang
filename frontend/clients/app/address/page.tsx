"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Province = { code: number; name: string };
type District = { code: number; name: string };
type Ward = { code: number; name: string };

export default function AddressPage() {
  const router = useRouter();
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

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

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
      setMessage("❌ Bạn cần đăng nhập để thực hiện thao tác này.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi tạo địa chỉ.");
      toast.success("✅ Tạo địa chỉ thành công!");

      setFormData({
        receiverName: "",
        phone: "",
        addressLine: "",
        city: "",
        district: "",
        ward: "",
        isDefault: false,
      });
      router.push("/product");
      setDistricts([]);
      setWards([]);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tạo địa chỉ mới</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="receiverName"
          placeholder="Tên người nhận"
          value={formData.receiverName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="addressLine"
          placeholder="Địa chỉ chi tiết (số nhà, ngõ, đường...)"
          value={formData.addressLine}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <select
          onChange={handleProvinceChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Chọn Tỉnh / Thành phố</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          onChange={handleDistrictChange}
          className="w-full p-2 border rounded"
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

        <select
          onChange={handleWardChange}
          className="w-full p-2 border rounded"
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

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          <span>Đặt làm mặc định</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang gửi..." : "Gửi"}
        </button>

        {message && (
          <p
            className={`mt-2 text-sm font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
