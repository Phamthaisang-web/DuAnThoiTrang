"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
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
exports.default = {
    paymentCreateSchema,
    paymentUpdateSchema,
    paymentGetByIdSchema,
    paymentDeleteByIdSchema,
};
//# sourceMappingURL=payments.validation.js.map