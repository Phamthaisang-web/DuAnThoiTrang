import * as yup from 'yup';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const paymentCreateSchema = yup.object({
  body: yup.object({
    order: yup.string()
      .matches(objectIdRegex, 'Order ID must be a valid ObjectId.')
      .required('Order is required.'),

    paymentDate: yup.date()
      .default(() => new Date())
      .optional(),

    amount: yup.number()
      .min(0, 'Amount must be at least 0.')
      .required('Amount is required.'),

    method: yup.string()
      .oneOf(["bank_transfer", "cash"], 'Method must be either "bank_transfer" or "cash".')
      .required('Payment method is required.'),
  }).required(),
}).required();

const paymentUpdateSchema = yup.object({
  params: yup.object({
    id: yup.string()
      .matches(objectIdRegex, 'ID must be a valid ObjectId.')
      .required('ID is required.'),
  }),
  body: yup.object({
    order: yup.string()
      .matches(objectIdRegex, 'Order ID must be a valid ObjectId.')
      .optional(),

    paymentDate: yup.date().optional(),

    amount: yup.number()
      .min(0, 'Amount must be at least 0.')
      .optional(),

    method: yup.string()
      .oneOf(["bank_transfer", "cash"], 'Method must be either "bank_transfer" or "cash".')
      .optional(),
  }),
}).required();

const paymentGetByIdSchema = yup.object({
  params: yup.object({
    id: yup.string()
      .matches(objectIdRegex, 'ID must be a valid ObjectId.')
      .required('ID is required.'),
  }),
}).required();

const paymentDeleteByIdSchema = yup.object({
  params: yup.object({
    id: yup.string()
      .matches(objectIdRegex, 'ID must be a valid ObjectId.')
      .required('ID is required.'),
  }),
}).required();

export default {
  paymentCreateSchema,
  paymentUpdateSchema,
  paymentGetByIdSchema,
  paymentDeleteByIdSchema,
};
