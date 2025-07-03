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
  Lock,
  Eye,
  EyeOff,
  Crown,
} from "lucide-react";
import Link from "next/link";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UserPage() {
  const { user, tokens, hydrated, clearTokens, clearUser, setUser } =
    useAuthStore();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (hydrated && (!user || !tokens)) {
      router.push("/login");
    }
  }, [hydrated, user, tokens, router]);

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (): boolean => {
    const errors: PasswordErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
      isValid = false;
    } else if (
      !/[A-Z]/.test(passwordData.newPassword) ||
      !/[a-z]/.test(passwordData.newPassword) ||
      !/[0-9]/.test(passwordData.newPassword)
    ) {
      errors.newPassword = "Mật khẩu phải chứa chữ hoa, chữ thường và số";
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsChangingPassword(true);
    try {
      await axios.put(
        `http://localhost:8080/api/v1/users/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${tokens?.accessToken}`,
          },
        }
      );

      toast.success("Đổi mật khẩu thành công!");
      setPasswordMode(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error("Lỗi khi đổi mật khẩu:", err);
      let errorMessage = "Đổi mật khẩu thất bại";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message.includes("401")) {
        errorMessage = "Mật khẩu hiện tại không đúng";
      }
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUpdateUser = async () => {
    setIsUpdatingProfile(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/users/me`,
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
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center max-w-md w-full transform hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Chưa đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để xem thông tin tài khoản
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Đi đến trang đăng nhập
          </button>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.01] transition-all duration-500">
          {/* Header */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-2xl"></div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center transition-all duration-300 transform hover:scale-110 ${
                  user.role === "admin"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                    : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                }`}
              >
                {user.role === "admin" ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Quản trị viên
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Người dùng
                  </>
                )}
              </span>

              {!user.isActive && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center shadow-lg animate-pulse">
                  <XCircle className="w-3 h-3 mr-1" />
                  Chưa kích hoạt
                </span>
              )}
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <div className="w-24 h-24 border-4 border-white/30 rounded-full bg-gradient-to-br from-white to-gray-100 text-gray-800 flex items-center justify-center text-xl font-bold shadow-2xl group-hover:scale-110 transition-all duration-300">
                  {getInitials(user.fullName)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {user.fullName}
              </h1>
              <p className="text-gray-300 text-sm mb-2">
                Thông tin tài khoản cá nhân
              </p>
              <p className="text-gray-400 text-xs font-mono bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                ID: {user._id}
              </p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <Link
              href="/orderdetail"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center h-12 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Đơn hàng của bạn
            </Link>
          </div>

          {/* Content */}
          <div className="p-8">
            {passwordMode ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl transform hover:scale-110 transition-all duration-300">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Đổi mật khẩu
                  </h2>
                  <p className="text-gray-600">
                    Cập nhật mật khẩu để bảo mật tài khoản tốt hơn
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "currentPassword",
                      label: "Mật khẩu hiện tại",
                      type: "current",
                    },
                    { id: "newPassword", label: "Mật khẩu mới", type: "new" },
                    {
                      id: "confirmPassword",
                      label: "Xác nhận mật khẩu mới",
                      type: "confirm",
                    },
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label
                        htmlFor={field.id}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>
                      <div className="relative group">
                        <input
                          id={field.id}
                          name={field.id}
                          type={
                            showPassword[
                              field.type as keyof typeof showPassword
                            ]
                              ? "text"
                              : "password"
                          }
                          value={passwordData[field.id as keyof PasswordData]}
                          onChange={handlePasswordChange}
                          className={`w-full px-3 py-3 border-2 ${
                            passwordErrors[field.id as keyof PasswordErrors]
                              ? "border-red-400 bg-red-50 focus:border-red-500"
                              : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                          } rounded-xl outline-none pr-10 transition-all duration-300 focus:shadow-lg`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility(
                              field.type as keyof typeof showPassword
                            )
                          }
                          className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors duration-300 transform hover:scale-110"
                        >
                          {showPassword[
                            field.type as keyof typeof showPassword
                          ] ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordErrors[field.id as keyof PasswordErrors] && (
                        <p className="text-red-500 text-sm mt-1 flex items-center bg-red-50 p-3 rounded-xl border border-red-200 animate-pulse">
                          <XCircle className="w-4 h-4 mr-2" />
                          {passwordErrors[field.id as keyof PasswordErrors]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className={`flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isChangingPassword ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Đổi mật khẩu
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setPasswordMode(false);
                      setPasswordErrors({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </button>
                </div>
              </div>
            ) : editMode ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl transform hover:scale-110 transition-all duration-300">
                    <Edit3 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Chỉnh sửa thông tin
                  </h2>
                  <p className="text-gray-600">
                    Cập nhật thông tin cá nhân của bạn
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Họ và tên
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={updatedUser.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 rounded-xl outline-none transition-all duration-300 focus:shadow-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số điện thoại
                    </label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={updatedUser.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 focus:border-blue-500 hover:border-gray-300 rounded-xl outline-none transition-all duration-300 focus:shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleUpdateUser}
                    disabled={isUpdatingProfile}
                    className={`flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isUpdatingProfile ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105"
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
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-600 mb-1">
                          Email
                        </p>
                        <p className="font-semibold text-gray-800 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-600 mb-1">
                            Số điện thoại
                          </p>
                          <p className="font-semibold text-gray-800">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`${
                      user.isActive
                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
                        : "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                    } border-2 rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                          user.isActive
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                            : "bg-gradient-to-br from-red-500 to-red-600"
                        }`}
                      >
                        {user.isActive ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium mb-1 ${
                            user.isActive ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          Trạng thái tài khoản
                        </p>
                        <p
                          className={`font-semibold ${
                            user.isActive ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {user.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.createdAt && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-purple-600 mb-1">
                            Ngày tạo tài khoản
                          </p>
                          <p className="font-semibold text-gray-800">
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
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t-2 border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
                    </button>

                    <button
                      onClick={() => setPasswordMode(true)}
                      className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex-1 h-12 border-2 border-gray-800 hover:bg-gray-800 hover:text-white text-gray-800 rounded-xl font-medium transition-all duration-300 flex items-center justify-center transform hover:scale-105 shadow-lg hover:shadow-xl"
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
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Tài khoản được tạo và quản lý bởi hệ thống
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Liên hệ quản trị viên nếu cần hỗ trợ
          </p>
        </div>
      </div>
    </div>
  );
}
