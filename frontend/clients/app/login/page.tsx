"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/useAuthStore"; // cập nhật đúng path đến store của bạn
import toast from "react-hot-toast";

// Interface định nghĩa token
interface ITokens {
  accessToken: string;
  refreshToken: string;
}

// Interface định nghĩa phản hồi từ API
interface IApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface IUser {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: "user" | "admin";
  isActive?: boolean;
  createdAt?: Date;
}
export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:8080/api/v1/login"
      : "http://localhost:8080/api/v1/users";

    const data = isLogin
      ? {
          email: form.email,
          password: form.password,
        }
      : form;

    try {
      const res = await axios.post<IApiResponse<ITokens>>(url, data, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Thành công!");

      if (isLogin) {
        const { accessToken, refreshToken } = res.data.data;

        const userRes = await axios.get<IApiResponse<IUser>>(
          "http://localhost:8080/api/v1/get-profile",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        useAuthStore.getState().setTokens({ accessToken, refreshToken });
        useAuthStore.getState().setUser(userRes.data.data);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        router.push("/product");
      } else {
        toast.success("Đăng ký thành công. Mời bạn đăng nhập!");
        setIsLogin(true);
      }
    } catch (err: any) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        const message = err.response.data.message;

        if (
          message.toLowerCase().includes("email") ||
          message.toLowerCase().includes("password")
        ) {
          toast.error("Email hoặc mật khẩu không đúng.");
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }

      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-200 to-indigo-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Đăng Nhập" : "Đăng Ký"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={form.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold ml-2 hover:underline"
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
