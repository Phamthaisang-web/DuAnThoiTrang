import * as yup from 'yup';

const brandCreateSchema = yup.object({
  body: yup.object({
    name: yup.string()
      .min(3, 'Name must be at least 3 characters long.')
      .max(255, 'Name must not exceed 255 characters.')
      .required('Name is required.'), // required field

    country: yup.string()
      .max(100, 'Country must not exceed 100 characters.')
      .optional(), // optional field
  }).required(),
}).required();

const brandUpdateSchema = yup.object({
  params: yup.object({
    id: yup.string()
      .matches(/^[0-9a-fA-F]{24}$/, { message: 'ID must be a valid ObjectId.' })
      .required('ID is required.'),
  }),
  body: yup.object({
    name: yup.string()
      .min(3, 'Name must be at least 3 characters long.')
      .max(255, 'Name must not exceed 255 characters.')
      .optional(), // optional, as it's an update

    country: yup.string()
      .max(100, 'Country must not exceed 100 characters.')
      .optional(), // optional, as it's an update
  }),
}).required();

const brandGetByIdSchema = yup.object({
  params: yup.object({
    id: yup.string()
      .matches(/^[0-9a-fA-F]{24}$/, { message: 'ID must be a valid ObjectId.' })
      .required('ID is required.'),
  }),
}).required();

const brandDeleteByIdSchema = yup.object({
  params: yup.object({
    id: yup.string()
      .matches(/^[0-9a-fA-F]{24}$/, { message: 'ID must be a valid ObjectId.' })
      .required('ID is required.'),
  }),
}).required();

export default {
  brandCreateSchema,
  brandUpdateSchema,
  brandGetByIdSchema,
  brandDeleteByIdSchema,
};
