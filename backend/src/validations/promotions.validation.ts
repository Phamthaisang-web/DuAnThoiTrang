import * as yup from "yup";

// Schema tạo mới promotion
const promotionCreateSchema = yup.object({
  body: yup.object({
    code: yup
      .string()
      .min(3, "Promotion code must be at least 3 characters long.")
      .max(50, "Promotion code must not exceed 50 characters.")
      .required("Promotion code is required."),

    type: yup
      .string()
      .oneOf(["percent", "fixed"], 'Type must be either "percent" or "fixed".')
      .required("Type is required."),

    value: yup
      .number()
      .min(0, "Value must be non-negative.")
      .required("Value is required."),

    maxDiscount: yup
      .number()
      .min(0, "Max discount must be non-negative.")
      .optional(),

    expiredAt: yup.date().required("Expired date is required."),

    isActive: yup.boolean().optional(),

    description: yup
      .string()
      .max(500, "Description must not exceed 500 characters.")
      .optional(),

    quantity: yup
      .number()
      .min(1, "Quantity must be at least 1.")
      .nullable()
      .optional(),

    usedCount: yup
      .number()
      .min(0, "Used count must be non-negative.")
      .optional(),
  }),
});

// Schema cập nhật promotion
const promotionUpdateSchema = yup.object({
  params: yup.object({
    id: yup
      .string()
      .matches(/^[0-9a-fA-F]{24}$/, {
        message: "Promotion ID must be a valid ObjectId.",
      })
      .required("Promotion ID is required."),
  }),
  body: yup.object({
    code: yup
      .string()
      .min(3, "Promotion code must be at least 3 characters long.")
      .max(50, "Promotion code must not exceed 50 characters.")
      .optional(),

    type: yup
      .string()
      .oneOf(["percent", "fixed"], 'Type must be either "percent" or "fixed".')
      .optional(),

    value: yup.number().min(0, "Value must be non-negative.").optional(),

    maxDiscount: yup
      .number()
      .min(0, "Max discount must be non-negative.")
      .optional(),

    expiredAt: yup.date().optional(),

    isActive: yup.boolean().optional(),

    description: yup
      .string()
      .max(500, "Description must not exceed 500 characters.")
      .optional(),

    quantity: yup
      .number()
      .min(1, "Quantity must be at least 1.")
      .nullable()
      .optional(),

    // Đừng cho user chỉnh `usedCount` nếu không tin cậy client
    usedCount: yup
      .number()
      .min(0, "Used count must be non-negative.")
      .optional(),
  }),
});

// Schema get by ID
const promotionGetByIdSchema = yup.object({
  params: yup.object({
    id: yup
      .string()
      .matches(/^[0-9a-fA-F]{24}$/, {
        message: "Promotion ID must be a valid ObjectId.",
      })
      .required("Promotion ID is required."),
  }),
});

// Schema delete by ID
const promotionDeleteByIdSchema = yup.object({
  params: yup.object({
    id: yup
      .string()
      .matches(/^[0-9a-fA-F]{24}$/, {
        message: "Promotion ID must be a valid ObjectId.",
      })
      .required("Promotion ID is required."),
  }),
});

export default {
  promotionCreateSchema,
  promotionUpdateSchema,
  promotionGetByIdSchema,
  promotionDeleteByIdSchema,
};
