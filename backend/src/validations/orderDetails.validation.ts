import * as yup from "yup";

const orderDetailCreateSchema = yup
  .object({
    body: yup
      .object({
        order: yup
          .string()
          .matches(/^[0-9a-fA-F]{24}$/, {
            message: "Order ID must be a valid ObjectId.",
          })
          .required("Order is required."), // Order ID is required

        product: yup
          .string()
          .matches(/^[0-9a-fA-F]{24}$/, {
            message: "Product ID must be a valid ObjectId.",
          })
          .required("Product is required."), // Product ID is required

        quantity: yup
          .number()
          .min(1, "Quantity must be at least 1.")
          .required("Quantity is required."), // Quantity must be greater than or equal to 1

        unitPrice: yup
          .number()
          .min(0, "Unit price must be at least 0.")
          .required("Unit price is required."), // Unit price must be greater than or equal to 0
      })
      .required(),
  })
  .required();

const orderDetailUpdateSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(/^[0-9a-fA-F]{24}$/, {
          message: "ID must be a valid ObjectId.",
        })
        .required("ID is required."),
    }),
    body: yup.object({
      order: yup
        .string()
        .matches(/^[0-9a-fA-F]{24}$/, {
          message: "Order ID must be a valid ObjectId.",
        })
        .optional(), // Optional for updating

      product: yup
        .string()
        .matches(/^[0-9a-fA-F]{24}$/, {
          message: "Product ID must be a valid ObjectId.",
        })
        .optional(), // Optional for updating

      quantity: yup.number().min(1, "Quantity must be at least 1.").optional(), // Optional for updating

      unitPrice: yup
        .number()
        .min(0, "Unit price must be at least 0.")
        .optional(), // Optional for updating
    }),
  })
  .required();

const orderDetailGetByIdSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(/^[0-9a-fA-F]{24}$/, {
          message: "ID must be a valid ObjectId.",
        })
        .required("ID is required."),
    }),
  })
  .required();

const orderDetailDeleteByIdSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(/^[0-9a-fA-F]{24}$/, {
          message: "ID must be a valid ObjectId.",
        })
        .required("ID is required."),
    }),
  })
  .required();

export default {
  orderDetailCreateSchema,
  orderDetailUpdateSchema,
  orderDetailGetByIdSchema,
  orderDetailDeleteByIdSchema,
};
