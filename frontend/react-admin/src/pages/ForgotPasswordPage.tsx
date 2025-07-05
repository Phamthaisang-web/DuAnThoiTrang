import React, { useState } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import axios from "axios";
import { env } from "../constants/getEnvs";
import { useNavigate } from "react-router";

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [email, setEmail] = useState("");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleRequestOtp = async (values: any) => {
    try {
      await axios.post(`${env.API_URL}/api/v1/forgot-password`, {
        email: values.email,
      });

      setEmail(values.email);
      setStep("verify");
      messageApi.success("Mã OTP đã được gửi đến email.");
    } catch (error: any) {
      console.error(error);
      messageApi.error(error.response?.data?.message || "Lỗi khi gửi OTP.");
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      await axios.post(`${env.API_URL}/api/v1/reset-password`, {
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      messageApi.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.");
      navigate("/login");
      setStep("request");
      form.resetFields();
    } catch (error: any) {
      console.error(error);
      messageApi.error(
        error.response?.data?.message || "Lỗi khi xác minh OTP."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      {contextHolder}
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <Typography.Title level={3} className="text-center text-indigo-600">
          {step === "request" ? "Quên mật khẩu" : "Xác minh OTP"}
        </Typography.Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={step === "request" ? handleRequestOtp : handleResetPassword}
        >
          {step === "request" ? (
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input placeholder="example@email.com" size="large" />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Mã OTP"
                name="otp"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
              >
                <Input placeholder="Nhập mã OTP" size="large" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới" },
                ]}
              >
                <Input.Password placeholder="Mật khẩu mới" size="large" />
              </Form.Item>
            </>
          )}

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {step === "request" ? "Gửi mã OTP" : "Đặt lại mật khẩu"}
            </Button>
          </Form.Item>

          <div className="flex justify-between">
            {step === "verify" && (
              <Button type="link" onClick={() => setStep("request")}>
                ← Quay lại nhập email
              </Button>
            )}

            <Button type="link" onClick={() => navigate("/login")}>
              ← Trở về đăng nhập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
