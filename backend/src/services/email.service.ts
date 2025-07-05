// services/email.service.ts

// utils/mailer.ts
import nodemailer from "nodemailer";
import { env } from "process";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_ACCOUNT,
    pass: env.EMAIL_PASSWORD,
  },
});

export default transporter;

export const sendVerificationCodeEmail = async (
  email: string,
  fullName: string,
  code: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_ACCOUNT,
    to: email,
    subject: "Mã xác nhận tài khoản - Cửa Hàng ABC",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Xin chào ${fullName},</h2>
        <p>Đây là mã xác nhận tài khoản của bạn:</p>

        <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #007bff;">
          ${code}
        </div>

        <p>Mã có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với người khác.</p>

        <p>Trân trọng,<br><strong>Đội ngũ Cửa Hàng ABC</strong></p>

        <hr style="margin-top: 40px;" />
        <p style="font-size: 12px; color: #888;">
          Đây là email tự động. Vui lòng không phản hồi lại email này.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
