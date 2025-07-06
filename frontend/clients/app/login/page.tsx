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
  X,
} from "lucide-react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  // Forgot Password State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<
    "email" | "otp" | "newPassword"
  >("email");
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForgotPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForgotPasswordData({
      ...forgotPasswordData,
      [e.target.name]: e.target.value,
    });
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
      console.log("ssssssss" + apiUrl);
      await axios.post(`${apiUrl}/api/v1/users/request-otp`, form, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setUserEmail(form.email);
      setStep("otp");
    } catch (err) {
      handleError(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${apiUrl}/api/v1/users/verify-otp`,
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
        `${apiUrl}/api/v1/login`,
        { email: form.email, password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { accessToken, refreshToken } = res.data.data;
      const userRes = await axios.get<IApiResponse<IUser>>(
        `${apiUrl}/api/v1/get-profile`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      useAuthStore.getState().setTokens({ accessToken, refreshToken });
      useAuthStore.getState().setUser(userRes.data.data);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      router.push("/product");
    } catch (err) {
      toast.error("Email hoặc mật khẩu không đúng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && step === "form") {
      const { password } = form;

      if (password.length < 8) {
        toast.error("Mật khẩu phải có ít nhất 8 ký tự");
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      return;
    }

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
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Bước 1: Gửi yêu cầu nhận OTP
      if (forgotPasswordStep === "email") {
        if (!forgotPasswordData.email) {
          toast.error("Vui lòng nhập email hợp lệ!");
          return;
        }

        await axios.post(`${apiUrl}/api/v1/forgot-password`, {
          email: forgotPasswordData.email,
        });

        toast.success("Mã OTP đã được gửi đến email của bạn!");
        setForgotPasswordStep("otp");

        // Bước 2: Nhập OTP + mật khẩu mới
      } else {
        const { email, otp, newPassword, confirmPassword } = forgotPasswordData;

        if (!otp) {
          toast.error("Vui lòng nhập mã OTP!");
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error("Mật khẩu mới và xác nhận không khớp!");
          return;
        }

        if (newPassword.length < 8) {
          toast.error("Mật khẩu phải có ít nhất 8 ký tự");
          return;
        }
        await axios.post(`${apiUrl}/api/v1/reset-password`, {
          email,
          otp,
          newPassword,
        });

        toast.success("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.");
        setIsForgotPasswordOpen(false);
        setForgotPasswordStep("email");
        setForgotPasswordData({
          email: "",
          otp: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-gray-900/5 to-zinc-900/5"></div>
      <div className="relative w-full max-w-md mx-2 sm:mx-4">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800 p-6 sm:p-8 text-white text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-white/20 rounded-full flex items-center justify-center">
              <Store className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
              Fashion Store
            </h1>
            <p className="text-slate-200 text-xs sm:text-sm">
              Thời trang hàng hiệu đẳng cấp
            </p>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Login/Register Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6 md:mb-8">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setStep("form");
                }}
                className={`flex-1 py-1 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
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
                className={`flex-1 py-1 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                  !isLogin
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-gray-600 hover:text-slate-800"
                }`}
              >
                Đăng Ký
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3 sm:space-y-4 md:space-y-6"
            >
              {!isLogin && step === "otp" ? (
                <>
                  <div className="space-y-1 sm:space-y-2">
                    <label
                      htmlFor="otp"
                      className="block text-xs sm:text-sm font-medium text-gray-700"
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Mã OTP có hiệu lực trong 10 phút
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {!isLogin && (
                    <>
                      <div className="space-y-1 sm:space-y-2">
                        <label
                          htmlFor="fullName"
                          className="block text-xs sm:text-sm font-medium text-gray-700"
                        >
                          Họ và tên
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Nhập họ và tên"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-2">
                        <label
                          htmlFor="phone"
                          className="block text-xs sm:text-sm font-medium text-gray-700"
                        >
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1 sm:space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
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
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Mật khẩu
                    </label>
                    <div className="relative">
                      {/* Lock Icon */}
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>

                      {/* Password Input */}
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-10 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      />

                      {/* Toggle Eye Icon */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Mật khẩu phải có ít nhất 8 ký tự và số.
                    </p>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm sm:text-base py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {!isLogin && step === "otp"
                      ? "Xác minh OTP"
                      : isLogin
                      ? "Đăng Nhập"
                      : "Đăng Ký"}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </>
                )}
              </button>
            </form>

            {isLogin && (
              <div className="mt-3 sm:mt-4 text-center">
                <button
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs sm:text-sm text-slate-600 hover:text-slate-800 font-medium"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-gray-600 text-xs sm:text-sm">
                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setStep("form");
                  }}
                  className="ml-1 sm:ml-2 text-slate-700 hover:text-slate-900 font-semibold transition-colors"
                >
                  {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs sm:text-sm text-gray-600 border border-gray-200">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500" />
            Bảo mật SSL 256-bit
          </div>
        </div>

        <div className="mt-2 sm:mt-4 text-center text-xs text-gray-500">
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

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl w-full max-w-sm sm:max-w-md relative mx-2 sm:mx-4">
            <button
              onClick={() => {
                setIsForgotPasswordOpen(false);
                setForgotPasswordStep("email");
                setForgotPasswordData({
                  email: "",
                  otp: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className={`flex-1 py-1 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-gray-600 hover:text-slate-800"
              }`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>

            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                {forgotPasswordStep === "email" && "Quên mật khẩu"}
                {forgotPasswordStep === "otp" && "Xác minh OTP"}
                {forgotPasswordStep === "newPassword" && "Đặt lại mật khẩu"}
              </h2>

              <form
                onSubmit={handleForgotPasswordSubmit}
                className="space-y-3 sm:space-y-4"
              >
                {forgotPasswordStep === "email" && (
                  <div className="space-y-1 sm:space-y-2">
                    <label
                      htmlFor="forgot-email"
                      className="block text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Email đăng ký
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="forgot-email"
                        name="email"
                        placeholder="your@email.com"
                        value={forgotPasswordData.email}
                        onChange={handleForgotPasswordChange}
                        required
                        className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {forgotPasswordStep === "otp" && (
                  <>
                    {/* OTP Input */}
                    <div className="space-y-1 sm:space-y-2">
                      <label
                        htmlFor="forgot-otp"
                        className="block text-xs sm:text-sm font-medium text-gray-700"
                      >
                        Mã OTP đã gửi đến {forgotPasswordData.email}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="forgot-otp"
                          name="otp"
                          placeholder="Nhập mã OTP 6 chữ số"
                          value={forgotPasswordData.otp}
                          onChange={handleForgotPasswordChange}
                          required
                          maxLength={6}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Mã OTP có hiệu lực trong 10 phút
                      </p>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
                      <label
                        htmlFor="new-password"
                        className="block text-xs sm:text-sm font-medium text-gray-700"
                      >
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="new-password"
                          name="newPassword"
                          placeholder="Nhập mật khẩu mới"
                          value={forgotPasswordData.newPassword}
                          onChange={handleForgotPasswordChange}
                          required
                          pattern=".{8,}"
                          title="Ít nhất 8 ký tự"
                          className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Mật khẩu phải có ít nhất 8 ký tự
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
                      <label
                        htmlFor="confirm-password"
                        className="block text-xs sm:text-sm font-medium text-gray-700"
                      >
                        Xác nhận mật khẩu mới
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="confirm-password"
                          name="confirmPassword"
                          placeholder="Nhập lại mật khẩu mới"
                          value={forgotPasswordData.confirmPassword}
                          onChange={handleForgotPasswordChange}
                          required
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:ring-opacity-20 outline-none transition-all"
                        />
                      </div>
                      {forgotPasswordData.newPassword &&
                        forgotPasswordData.confirmPassword &&
                        forgotPasswordData.newPassword !==
                          forgotPasswordData.confirmPassword && (
                          <p className="text-xs text-red-500">
                            Mật khẩu xác nhận không khớp.
                          </p>
                        )}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm sm:text-base py-2 sm:py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {forgotPasswordStep === "email" && "Gửi mã OTP"}
                      {forgotPasswordStep === "otp" &&
                        "Xác nhận và đặt lại mật khẩu"}
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
