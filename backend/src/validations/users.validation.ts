import * as yup from "yup";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createUserSchema = yup
  .object({
    body: yup.object({
      fullName: yup.string().min(3).max(255).required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).max(255).required(),
      phone: yup.string().max(20).optional(),

      role: yup.string().oneOf(["user", "admin"]).optional(),
      isActive: yup.boolean().optional(),
    }),
  })
  .required();

const updateUserSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(objectIdRegex, { message: "ID is non-ObjectId" })
        .required(),
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

const getUserByIdSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(objectIdRegex, { message: "ID is non-ObjectId" })
        .required(),
    }),
  })
  .required();

const deleteUserByIdSchema = yup
  .object({
    params: yup.object({
      id: yup
        .string()
        .matches(objectIdRegex, { message: "ID is non-ObjectId" })
        .required(),
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
        .matches(/^(asc|desc)$/)
        .optional(),
      sort_type: yup
        .string()
        .matches(/^(createdAt|fullName|email|role)$/)
        .optional(),
      keyword: yup.string().min(3).max(50).optional(), // search fullName or email
    }),
  })
  .required();

export default {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  deleteUserByIdSchema,
  getAllUsersSchema,
};
