import React, { useState, useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import axios from "axios";
import { env } from "../constants/getEnvs";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";

type TFormData = {
  email: string;
  password: string;
  remember: boolean;
};

const LoginPage: React.FC = () => {
  const { setTokens, clearTokens, setUser } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("login_email") || "";
    const savedPassword = localStorage.getItem("login_password") || "";

    form.setFieldsValue({
      email: savedEmail,
      password: savedPassword,
      remember: !!(savedEmail && savedPassword),
    });
  }, []);

  const [form] = Form.useForm();

  const onFinish = async (values: TFormData) => {
    try {
      setIsLoading(true);

      if (values.remember) {
        localStorage.setItem("login_email", values.email);
        localStorage.setItem("login_password", values.password);
      } else {
        localStorage.removeItem("login_email");
        localStorage.removeItem("login_password");
      }

      const responseLogin = await axios.post(`${env.API_URL}/api/v1/login`, {
        email: values.email,
        password: values.password,
      });

      if (responseLogin.status === 200) {
        const tokens = responseLogin.data.data;
        setTokens(tokens);

        const responseProfile = await axios.get(
          `${env.API_URL}/api/v1/get-profile`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );

        if (responseProfile.status === 200) {
          const user = responseProfile.data.data;

          if (user.role !== "admin") {
            clearTokens();
            messageApi.error("Chỉ tài khoản admin mới được phép đăng nhập.");
            return;
          }

          setUser(user);
          navigate("/");
        } else {
          messageApi.error("Không lấy được thông tin người dùng.");
        }
      } else {
        messageApi.error("Tài khoản hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      console.error("Login error:", error);
      messageApi.error("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      {contextHolder}
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          Admin Login
        </h2>

        <Form form={form} name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-500" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-500" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center justify-between">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-indigo-600 hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </span>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              block
              type="primary"
              size="large"
              htmlType="submit"
              loading={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
