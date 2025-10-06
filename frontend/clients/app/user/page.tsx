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
} from "lucide-react";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
        `${apiUrl}/api/v1/users/change-password`,
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
        `${apiUrl}/api/v1/users/me`,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để xem thông tin tài khoản
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full text-gray-900 flex items-center justify-center text-lg font-semibold">
                  {getInitials(user.fullName)}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold mb-1">
                    {user.fullName}
                  </h1>
                  <p className="text-gray-400 text-sm">ID: {user._id}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </span>

                {!user.isActive && (
                  <span className="px-3 py-1 rounded-md text-xs font-medium bg-red-500 text-white">
                    Chưa kích hoạt
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <Link
              href="/orderdetail"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center h-11"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Đơn hàng của bạn
            </Link>
          </div>

          <div className="p-8">
            {passwordMode ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-gray-700" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Đổi mật khẩu
                  </h2>
                  <p className="text-gray-600 text-sm">
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
                      <div className="relative">
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
                          className={`w-full px-3 py-2.5 border ${
                            passwordErrors[field.id as keyof PasswordErrors]
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300 focus:border-gray-900"
                          } rounded-lg outline-none pr-10 transition-colors`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility(
                              field.type as keyof typeof showPassword
                            )
                          }
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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
                        <p className="text-red-600 text-sm flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {passwordErrors[field.id as keyof PasswordErrors]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className={`flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center ${
                      isChangingPassword ? "opacity-50 cursor-not-allowed" : ""
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
                    className="flex-1 h-11 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </button>
                </div>
              </div>
            ) : editMode ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-6 h-6 text-gray-700" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Chỉnh sửa thông tin
                  </h2>
                  <p className="text-gray-600 text-sm">
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
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={updatedUser.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:border-gray-900 rounded-lg outline-none transition-colors"
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
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={updatedUser.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 focus:border-gray-900 rounded-lg outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateUser}
                    disabled={isUpdatingProfile}
                    className={`flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center ${
                      isUpdatingProfile ? "opacity-50 cursor-not-allowed" : ""
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
                    className="flex-1 h-11 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Email
                        </p>
                        <p className="font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Số điện thoại
                          </p>
                          <p className="font-medium text-gray-900">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {user.isActive ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Trạng thái tài khoản
                        </p>
                        <p
                          className={`font-medium ${
                            user.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user.isActive ? "Đã kích hoạt" : "Chưa kích hoạt"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {user.createdAt && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Ngày tạo tài khoản
                          </p>
                          <p className="font-medium text-gray-900">
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

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Chỉnh sửa thông tin
                    </button>

                    <button
                      onClick={() => setPasswordMode(true)}
                      className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex-1 h-11 border border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 rounded-lg font-medium transition-colors flex items-center justify-center"
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

        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
          <p className="text-sm text-gray-600">
            Tài khoản được tạo và quản lý bởi hệ thống
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Liên hệ quản trị viên nếu cần hỗ trợ
          </p>
        </div>
      </div>
    </div>
  );
}
