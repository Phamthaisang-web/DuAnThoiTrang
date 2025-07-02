"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Store,
  ArrowRight,
  Shield,
} from "lucide-react";

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");
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

  const handleError = (err: any) => {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Đã xảy ra lỗi.");
    }
    console.error(err);
  };

  const handleRequestOTP = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8080/api/v1/users/request-otp", form, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setUserEmail(form.email);
      setStep("otp");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/v1/users/verify-otp",
        { email: userEmail, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Xác minh OTP thành công!");

      toast.success("Đăng ký thành công! Mời bạn đăng nhập.");
      setIsLogin(true);
      setStep("form");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post<IApiResponse<ITokens>>(
        "http://localhost:8080/api/v1/login",
        { email: form.email, password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { accessToken, refreshToken } = res.data.data;
      const userRes = await axios.get<IApiResponse<IUser>>(
        "http://localhost:8080/api/v1/get-profile",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      useAuthStore.getState().setTokens({ accessToken, refreshToken });
      useAuthStore.getState().setUser(userRes.data.data);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      router.push("/product");
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      await handleLogin();
    } else {
      if (step === "form") {
        await handleRequestOTP();
      } else {
        await handleVerifyOTP();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-gray-900/5 to-zinc-900/5"></div>
      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 p-8 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Fashion Store</h1>
            <p className="text-slate-200 text-sm">
              Thời trang hàng hiệu đẳng cấp
            </p>
          </div>

          <div className="p-8">
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setStep("form");
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  isLogin
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-gray-600 hover:text-slate-800"
                }`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setStep("form");
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isLogin
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-gray-600 hover:text-slate-800"
                }`}
              >
                Đăng Ký
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && step === "otp" ? (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nhập mã OTP đã gửi đến {userEmail}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        placeholder="Nhập mã OTP (6 chữ số)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Mã OTP có hiệu lực trong 5 phút
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {!isLogin && (
                    <>
                      <div className="space-y-2">
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Họ và tên
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Nhập họ và tên"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
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
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="Nhập số điện thoại"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            pattern="^0\d{9}$"
                            title="Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {!isLogin && step === "otp"
                      ? "Xác minh OTP"
                      : isLogin
                      ? "Đăng Nhập"
                      : "Đăng Ký"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setStep("form");
                  }}
                  className="ml-2 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
                >
                  {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                </button>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-600 border border-gray-200">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            Bảo mật SSL 256-bit
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Bằng việc đăng ký, bạn đồng ý với</p>
          <p>
            <a
              href="#"
              className="text-slate-600 hover:text-slate-800 underline"
            >
              Điều khoản dịch vụ
            </a>{" "}
            và
            <a
              href="#"
              className="text-slate-600 hover:text-slate-800 underline ml-1"
            >
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
