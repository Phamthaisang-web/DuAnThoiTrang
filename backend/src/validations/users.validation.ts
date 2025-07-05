import * as yup from "yup";

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

export default {
  requestOtpSchema,
  verifyOtpSchema,
  updateUserSchema,
  getUserByIdSchema,
  deleteUserByIdSchema,
  getAllUsersSchema,
};
