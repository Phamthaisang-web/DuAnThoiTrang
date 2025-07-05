import * as yup from "yup";

const objectId = yup
  .string()
  .matches(/^[0-9a-fA-F]{24}$/, "ID must be a valid ObjectId")
  .required("ID is required");

// Tạo địa chỉ mới
const create = yup
  .object({
    body: yup.object({
      receiverName: yup
        .string()
        .required("Receiver name is required")
        .min(2, "Receiver name must be at least 2 characters"),
      phone: yup
        .string()
        .required("Phone is required")
        .matches(/^\d{10,11}$/, "Phone number must be 10–11 digits"),
      addressLine: yup
        .string()
        .required("Address line is required")
        .max(255, "Address line cannot exceed 255 characters"),
      city: yup.string().optional().max(100),
      district: yup.string().optional().max(100),
      ward: yup.string().optional().max(100),
      isDefault: yup.boolean().optional(),
    }),
  })
  .required();

// Cập nhật địa chỉ
const update = yup
  .object({
    params: yup.object({
      id: objectId,
    }),
    body: yup.object({
      receiverName: yup.string().min(2).max(255).optional(),
      phone: yup
        .string()
        .matches(/^\d{10,11}$/, "Phone number must be 10–11 digits")
        .optional(),
      addressLine: yup.string().max(255).optional(),
      city: yup.string().optional().max(100),
      district: yup.string().optional().max(100),
      ward: yup.string().optional().max(100),
      isDefault: yup.boolean().optional(),
    }),
  })
  .required();

// Lấy/Xoá theo ID
const getById = yup
  .object({
    params: yup.object({
      id: objectId,
    }),
  })
  .required();

const deleteById = yup
  .object({
    params: yup.object({
      id: objectId,
    }),
  })
  .required();

export default {
  create,
  update,
  getById,
  deleteById,
};
