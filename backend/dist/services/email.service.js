"use strict";
// services/email.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationCodeEmail = void 0;
// utils/mailer.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const process_1 = require("process");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process_1.env.EMAIL_ACCOUNT,
        pass: process_1.env.EMAIL_PASSWORD,
    },
});
exports.default = transporter;
const sendVerificationCodeEmail = (email, fullName, code) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield transporter.sendMail(mailOptions);
});
exports.sendVerificationCodeEmail = sendVerificationCodeEmail;
//# sourceMappingURL=email.service.js.map