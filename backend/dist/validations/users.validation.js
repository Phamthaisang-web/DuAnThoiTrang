"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
// 🔹 Schema gửi OTP (đăng ký - lưu tempUser)
const requestOtpSchema = yup
    .object({
    body: yup.object({
        fullName: yup.string().min(3).max(255).required("Họ tên là bắt buộc"),
        email: yup
            .string()
            .email("Email không hợp lệ")
            .required("Email là bắt buộc"),
        password: yup.string().min(6).max(255).required("Mật khẩu là bắt buộc"),
        phone: yup.string().max(20).optional(),
        role: yup.string().oneOf(["user", "admin"]).optional(),
        isActive: yup.boolean().optional(),
    }),
})
    .required();
// 🔹 Schema xác minh OTP
const verifyOtpSchema = yup
    .object({
    body: yup.object({
        email: yup.string().email().required("Email là bắt buộc"),
        otp: yup
            .string()
            .matches(/^\d{6}$/, "OTP phải gồm 6 chữ số")
            .required("Mã OTP là bắt buộc"),
    }),
})
    .required();
// 🔹 Schema cập nhật user (PUT /users/:id)
const updateUserSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, { message: "ID không hợp lệ" })
            .required("ID là bắt buộc"),
    }),
    body: yup.object({
        fullName: yup.string().min(3).max(255).optional(),
        email: yup.string().email().optional(),
        password: yup.string().min(6).max(255).optional(),
        phone: yup.string().max(20).optional(),
        role: yup.string().oneOf(["user", "admin"]).optional(),
        isActive: yup.boolean().optional(),
    }),
})
    .required();
// 🔹 Schema lấy user theo ID
const getUserByIdSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, { message: "ID không hợp lệ" })
            .required("ID là bắt buộc"),
    }),
})
    .required();
// 🔹 Schema xóa user
const deleteUserByIdSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, { message: "ID không hợp lệ" })
            .required("ID là bắt buộc"),
    }),
})
    .required();
// 🔹 Schema truy vấn danh sách user
const getAllUsersSchema = yup
    .object({
    query: yup.object({
        page: yup.number().integer().positive().optional(),
        limit: yup.number().integer().positive().optional(),
        sort_by: yup
            .string()
            .matches(/^(asc|desc)$/)
            .optional(),
        sort_type: yup
            .string()
            .matches(/^(createdAt|fullName|email|role)$/)
            .optional(),
        keyword: yup.string().min(3).max(50).optional(),
    }),
})
    .required();
exports.default = {
    requestOtpSchema,
    verifyOtpSchema,
    updateUserSchema,
    getUserByIdSchema,
    deleteUserByIdSchema,
    getAllUsersSchema,
};
//# sourceMappingURL=users.validation.js.map