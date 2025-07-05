import * as yup from "yup";

const categoryCreateSchema = yup
  .object({
    body: yup
      .object({
        name: yup
          .string()
          .min(3, "Name must be at least 3 characters long.")
          .max(255, "Name must not exceed 255 characters.")
          .required("Name is required."), // Required field

        description: yup
          .string()
          .max(500, "Description must not exceed 500 characters.")
          .optional(),
      })
      .required(),
  })
  .required();

const categoryUpdateSchema = yup
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
      name: yup
        .string()
        .min(3, "Name must be at least 3 characters long.")
        .max(255, "Name must not exceed 255 characters.")
        .optional(), // Optional for updating

      description: yup
        .string()
        .max(500, "Description must not exceed 500 characters.")
        .optional(), // Optional for updating
    }),
  })
  .required();

const categoryGetByIdSchema = yup
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

const categoryDeleteByIdSchema = yup
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
  categoryCreateSchema,
  categoryUpdateSchema,
  categoryGetByIdSchema,
  categoryDeleteByIdSchema,
};
