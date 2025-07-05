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
exports.default = {
    orderDetailCreateSchema,
    orderDetailUpdateSchema,
    orderDetailGetByIdSchema,
    orderDetailDeleteByIdSchema,
};
//# sourceMappingURL=orderDetails.validation.js.map