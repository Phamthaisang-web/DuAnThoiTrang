"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit3,
  LogOut,
  Save,
  X,
} from "lucide-react";
import Link from "next/link";

export default function UserPage() {
  const { user, tokens, hydrated, clearTokens, clearUser, setUser } =
    useAuthStore();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    fullName: "",
    phone: "",
  });

  // Fix infinite loop by removing router from dependencies and adding condition
  useEffect(() => {
    if (hydrated && (!user || !tokens)) {
      router.push("/login");
      return;
    }
  }, [hydrated, user, tokens]); // Removed router from dependencies

  // Separate useEffect for updating user data
  useEffect(() => {
    if (user) {
      setUpdatedUser({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleLogout = () => {
    clearTokens();
    clearUser();
    router.push("/login");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const refreshUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
        }
      );
      setUser(response.data);
    } catch (err) {
      console.error("Lỗi khi làm mới dữ liệu:", err);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/v1/users/me",
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
        }
      );

      const updated = response.data.data;
      setUser(updated);
      setUpdatedUser({
        fullName: updated.fullName || "",
        phone: updated.phone || "",
      });

      toast.success("Cập nhật thông tin thành công!");
      setEditMode(false);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      toast.error("Cập nhật thất bại. Vui lòng thử lại."); // Fixed: was showing success for error
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl border-0 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Chưa đăng nhập
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng đăng nhập để xem thông tin tài khoản
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Đi đến trang đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-white">
            <div className="absolute top-4 right-4 flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                  user.role === "admin"
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
              </span>
              {!user.isActive && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  Chưa kích hoạt
                </span>
              )}
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-4 border-4 border-white/30 shadow-xl rounded-full bg-white text-violet-600 flex items-center justify-center text-xl font-bold">
                {getInitials(user.fullName)}
              </div>
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <p className="text-violet-100 text-sm opacity-90">
                Thông tin tài khoản cá nhân
              </p>
              <p className="text-violet-200 text-xs mt-1 font-mono">
                ID: {user._id}
              </p>
            </div>
          </div>
          <Link
            href="/orderdetail"
            className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Đơn hàng của bạn
          </Link>
          {/* Content */}
          <div className="p-8">
            {editMode ? (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Họ và tên
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={updatedUser.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số điện thoại
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={updatedUser.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-opacity-20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleUpdateUser}
                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 h-12 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Info Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-lg">
                    <div className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500">
                            Email
                          </p>
                          <p className="text-lg font-semibold text-gray-900 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-lg">
                      <div className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">
                              Số điện thoại
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-lg">
                    <div className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.isActive
                              ? "bg-gradient-to-br from-emerald-500 to-green-600"
                              : "bg-gradient-to-br from-rose-500 to-red-600"
                          }`}
                        >
                          {user.isActive ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <XCircle className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500">
                            Trạng thái tài khoản
                          </p>
                          <p
                            className={`text-lg font-semibold ${
                              user.isActive
                                ? "text-emerald-600"
                                : "text-rose-600"
                            }`}
                          >
                            {user.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {user.createdAt && (
                    <div className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-lg">
                      <div className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">
                              Ngày tạo tài khoản
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                              {new Date(user.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 h-12 border border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 h-12 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-0">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <User className="w-4 h-4" />
              <p className="text-sm">
                Tài khoản được tạo và quản lý bởi hệ thống
              </p>
            </div>
            <p className="text-xs mt-2 text-gray-400">
              Liên hệ quản trị viên nếu cần hỗ trợ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
