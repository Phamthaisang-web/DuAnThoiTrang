import * as yup from "yup";

// Biểu thức chính quy cho ObjectId (chuỗi 24 ký tự hex)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Schema tạo sản phẩm (ProductCreateSchema)
const productCreateSchema = yup
  .object({
    body: yup.object({
      // Tên sản phẩm: Chuỗi, tối thiểu 3 ký tự, tối đa 100 ký tự, BẮT BUỘC
      name: yup
        .string()
        .min(3, "Tên phải có ít nhất 3 ký tự.")
        .max(100, "Tên không được vượt quá 100 ký tự.")
        .required("Tên là bắt buộc."),

      // Mô tả: Chuỗi, tối đa 500 ký tự, KHÔNG BẮT BUỘC
      description: yup
        .string()
        .max(500, "Mô tả không được vượt quá 500 ký tự.")
        .optional(),

      // Giá: Số, tối thiểu 0, BẮT BUỘC
      price: yup
        .number()
        .min(0, "Giá phải lớn hơn hoặc bằng 0.")
        .required("Giá là bắt buộc."),

      // Số lượng trong kho: Số, tối thiểu 0, BẮT BUỘC
      stockQuantity: yup
        .number()
        .min(0, "Số lượng trong kho phải lớn hơn hoặc bằng 0.")
        .required("Số lượng trong kho là bắt buộc."),

      // Kích cỡ: Mảng chuỗi, chỉ được phép các giá trị: "XS", "S", "M", "L", "XL", KHÔNG BẮT BUỘC
      sizes: yup
        .array()
        .of(yup.string().oneOf(["XS", "S", "M", "L", "XL"]))
        .optional(),

      // Màu sắc: Mảng chuỗi, mỗi chuỗi phải khác rỗng sau khi loại bỏ khoảng trắng (trim), KHÔNG BẮT BUỘC
      colors: yup
        .array()
        .of(yup.string().trim().min(1, "Màu sắc không được để trống."))
        .optional(),

      // Danh mục: Mảng chuỗi, mỗi chuỗi phải là một ObjectId hợp lệ (24 ký tự hex), KHÔNG BẮT BUỘC
      categories: yup
        .array()
        .of(
          yup.string().matches(objectIdRegex, {
            message: "Mỗi ID danh mục phải là một ObjectId hợp lệ.",
          })
        )
        .optional(),

      // Thương hiệu: Chuỗi, phải là một ObjectId hợp lệ, KHÔNG BẮT BUỘC
      brand: yup
        .string()
        .matches(objectIdRegex, {
          message: "ID thương hiệu phải là một ObjectId hợp lệ.",
        })
        .optional(),
    }),
  })
  .required();

// Schema cập nhật sản phẩm (ProductUpdateSchema)
const productUpdateSchema = yup
  .object({
    params: yup.object({
      // ID sản phẩm trong params: Chuỗi, phải là ObjectId hợp lệ, BẮT BUỘC
      id: yup
        .string()
        .matches(objectIdRegex, {
          message: "ID sản phẩm phải là một ObjectId hợp lệ.",
        })
        .required("ID sản phẩm là bắt buộc."),
    }),
    body: yup.object({
      // Tên: Chuỗi, tối thiểu 3, tối đa 100, KHÔNG BẮT BUỘC
      name: yup.string().min(3).max(100).optional(),
      // Mô tả: Chuỗi, tối đa 500, KHÔNG BẮT BUỘC
      description: yup.string().max(500).optional(),
      // Giá: Số, tối thiểu 0, KHÔNG BẮT BUỘC
      price: yup.number().min(0).optional(),
      // Số lượng trong kho: Số, tối thiểu 0, KHÔNG BẮT BUỘC
      stockQuantity: yup.number().min(0).optional(),
      // Kích cỡ: Mảng chuỗi, oneOf "XS", "S", "M", "L", "XL", KHÔNG BẮT BUỘC
      sizes: yup
        .array()
        .of(yup.string().oneOf(["XS", "S", "M", "L", "XL"]))
        .optional(),
      // Màu sắc: Mảng chuỗi, min(1), KHÔNG BẮT BUỘC
      colors: yup.array().of(yup.string().trim().min(1)).optional(),
      // Danh mục: Mảng chuỗi, mỗi chuỗi phải là ObjectId hợp lệ, KHÔNG BẮT BUỘC
      categories: yup
        .array()
        .of(
          yup.string().matches(objectIdRegex, {
            message: "Mỗi ID danh mục phải là một ObjectId hợp lệ.",
          })
        )
        .optional(),
      // Thương hiệu: Chuỗi, phải là ObjectId hợp lệ, KHÔNG BẮT BUỘC
      brand: yup
        .string()
        .matches(objectIdRegex, {
          message: "ID thương hiệu phải là một ObjectId hợp lệ.",
        })
        .optional(),
    }),
  })
  .required();

// Schema lấy sản phẩm bằng ID (ProductGetByIdSchema)
const productGetByIdSchema = yup
  .object({
    params: yup.object({
      // ID sản phẩm trong params: Chuỗi, phải là ObjectId hợp lệ, BẮT BUỘC
      id: yup
        .string()
        .matches(objectIdRegex, {
          message: "ID sản phẩm phải là một ObjectId hợp lệ.",
        })
        .required("ID sản phẩm là bắt buộc."),
    }),
  })
  .required();

// Schema xóa sản phẩm bằng ID (ProductDeleteByIdSchema)
const productDeleteByIdSchema = yup
  .object({
    params: yup.object({
      // ID sản phẩm trong params: Chuỗi, phải là ObjectId hợp lệ, BẮT BUỘC
      id: yup
        .string()
        .matches(objectIdRegex, {
          message: "ID sản phẩm phải là một ObjectId hợp lệ.",
        })
        .required("ID sản phẩm là bắt buộc."),
    }),
  })
  .required();

export default {
  productCreateSchema,
  productUpdateSchema,
  productGetByIdSchema,
  productDeleteByIdSchema,
};
