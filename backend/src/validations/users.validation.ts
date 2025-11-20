import * as yup from "yup";

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const vietnamPhoneRegex =
  /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;

const requestOtpSchema = yup
  .object({
    body: yup.object({
      fullName: yup
        .string()
        .min(3, "Họ tên phải có ít nhất 3 ký tự")
        .max(255, "Họ tên không được vượt quá 255 ký tự")
        .required("Họ tên là bắt buộc"),

      email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),

      password: yup
        .string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .max(255, "Mật khẩu không được vượt quá 255 ký tự")
        .required("Mật khẩu là bắt buộc"),

      phone: yup
        .string()
        .matches(
          vietnamPhoneRegex,
          "Số điện thoại không hợp lệ (phải là số Việt Nam)"
        )
        .optional(),

      role: yup
        .string()
        .oneOf(["user", "admin"], "Vai trò không hợp lệ")
        .optional(),
      isActive: yup.boolean().optional(),
    }),
  })
  .required();

const verifyOtpSchema = yup
  .object({
    body: yup.object({
      email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      otp: yup
        .string()
        .matches(/^\d{6}$/, "OTP phải gồm 6 chữ số")
        .required("Mã OTP là bắt buộc"),
    }),
  })
  .required();

const updateUserSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(objectIdRegex, "ID không hợp lệ")
        .required("ID là bắt buộc"),
    }),
    body: yup.object({
      fullName: yup
        .string()
        .min(3, "Họ tên phải có ít nhất 3 ký tự")
        .max(255, "Họ tên không được vượt quá 255 ký tự")
        .optional(),

      email: yup.string().email("Email không hợp lệ").optional(),

      password: yup
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .max(255, "Mật khẩu không được vượt quá 255 ký tự")
        .optional(),

      phone: yup
        .string()
        .matches(
          vietnamPhoneRegex,
          "Số điện thoại không hợp lệ (phải là số Việt Nam)"
        )
        .optional(),

      role: yup
        .string()
        .oneOf(["user", "admin"], "Vai trò không hợp lệ")
        .optional(),
      isActive: yup.boolean().optional(),
    }),
  })
  .required();

const getUserByIdSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(objectIdRegex, "ID không hợp lệ")
        .required("ID là bắt buộc"),
    }),
  })
  .required();

const deleteUserByIdSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(objectIdRegex, "ID không hợp lệ")
        .required("ID là bắt buộc"),
    }),
  })
  .required();

const getAllUsersSchema = yup
  .object({
    query: yup.object({
      page: yup.number().integer().positive().optional(),
      limit: yup.number().integer().positive().optional(),

      sort_by: yup
        .string()
        .matches(
          /^(createdAt|fullName|email|role)$/,
          "Trường sắp xếp không hợp lệ"
        )
        .optional(),

      sort_type: yup
        .string()
        .matches(/^(asc|desc)$/, "Kiểu sắp xếp không hợp lệ (asc hoặc desc)")
        .optional(),

      keyword: yup
        .string()
        .min(2, "Từ khóa phải có ít nhất 2 ký tự")
        .max(50)
        .optional(),
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
