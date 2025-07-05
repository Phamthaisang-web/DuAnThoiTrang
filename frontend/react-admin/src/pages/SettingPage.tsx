import React, { useState } from "react";
import { Input, Button, message } from "antd";

import { useAuthStore } from "../stores/useAuthStore";
import axios from "axios";
import { env } from "../constants/getEnvs";

const SettingPage: React.FC = () => {
  const { user, setUser, tokens } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [updatedUser, setUpdatedUser] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validatePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      messageApi.error("Vui lòng nhập đầy đủ thông tin mật khẩu.");
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      messageApi.error("Mật khẩu xác nhận không khớp.");
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsChangingPassword(true);
    try {
      await axios.put(
        `${env.API_URL}/api/v1/users/change-password`,
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
      messageApi.success("Đổi mật khẩu thành công!");
      setPasswordMode(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.message.includes("401")
          ? "Mật khẩu hiện tại không đúng"
          : "Đổi mật khẩu thất bại");
      messageApi.error(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUpdateUser = async () => {
    setIsUpdatingProfile(true);
    try {
      const response = await axios.put(
        `${env.API_URL}/api/v1/users/me`,
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
      messageApi.success("Cập nhật thông tin thành công!");
      setEditMode(false);
    } catch (err) {
      messageApi.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center max-w-md w-full transform hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Chưa đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để xem thông tin tài khoản
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Đi đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      {contextHolder}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Cài đặt tài khoản
        </h2>

        {/* Thông tin người dùng */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">
            Thông tin cá nhân
          </h3>
          <div className="grid gap-4">
            <Input
              placeholder="Họ tên"
              disabled={!editMode}
              value={updatedUser.fullName}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, fullName: e.target.value })
              }
            />
            <Input
              placeholder="Số điện thoại"
              disabled={!editMode}
              value={updatedUser.phone}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, phone: e.target.value })
              }
            />
          </div>
          <div className="mt-4 flex gap-3">
            {!editMode ? (
              <Button type="primary" onClick={() => setEditMode(true)}>
                Chỉnh sửa
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleUpdateUser}
                  loading={isUpdatingProfile}
                  type="primary"
                >
                  Lưu thay đổi
                </Button>
                <Button onClick={() => setEditMode(false)}>Hủy</Button>
              </>
            )}
          </div>
        </div>

        {/* Đổi mật khẩu */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">
            Đổi mật khẩu
          </h3>
          {!passwordMode ? (
            <Button type="dashed" onClick={() => setPasswordMode(true)}>
              Đổi mật khẩu
            </Button>
          ) : (
            <div className="grid gap-4">
              <Input.Password
                placeholder="Mật khẩu hiện tại"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
              <Input.Password
                placeholder="Mật khẩu mới"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
              <Input.Password
                placeholder="Xác nhận mật khẩu mới"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <div className="flex gap-3">
                <Button
                  type="primary"
                  onClick={handleChangePassword}
                  loading={isChangingPassword}
                >
                  Lưu mật khẩu
                </Button>
                <Button onClick={() => setPasswordMode(false)}>Hủy</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
