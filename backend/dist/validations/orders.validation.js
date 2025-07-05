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
// 🎯 Regex cho ObjectId MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
// 🎯 CREATE ORDER: client không cần gửi user, nhưng cần gửi address
const orderCreateSchema = yup
    .object({
    body: yup
        .object({
        address: yup
            .string()
            .matches(objectIdRegex, "Address ID must be valid.")
            .required("Address is required."),
        orderDate: yup
            .date()
            .default(() => new Date())
            .optional(), // Hệ thống sẽ gán nếu không có
        status: yup
            .string()
            .max(50, "Status must not exceed 50 characters.")
            .oneOf([
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "return_requested",
            "returned",
        ], "Invalid order status.")
            .optional(),
        totalAmount: yup
            .number()
            .min(0, "Total amount must be at least 0.")
            .optional(), // Sẽ được tính lại từ items
        items: yup
            .array()
            .of(yup.object({
            product: yup
                .string()
                .matches(objectIdRegex, "Product ID must be valid.")
                .required("Product is required."),
            quantity: yup
                .number()
                .min(1, "Quantity must be at least 1.")
                .required("Quantity is required."),
            size: yup.string().oneOf(["XS", "S", "M", "L", "XL"]).optional(),
            color: yup.string().optional(),
        }))
            .min(1, "At least one item is required.")
            .required("Items are required."),
        promoCode: yup.string().optional(),
    })
        .required(),
})
    .required();
// 🎯 UPDATE ORDER: chỉ cho phép sửa status, ngày, totalAmount
const orderUpdateSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, "ID must be a valid ObjectId.")
            .required("ID is required."),
    }),
    body: yup
        .object({
        orderDate: yup.date().optional(),
        status: yup
            .string()
            .max(50, "Status must not exceed 50 characters.")
            .oneOf([
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "return_requested",
            "returned",
        ], "Invalid order status.")
            .optional(),
        totalAmount: yup
            .number()
            .min(0, "Total amount must be at least 0.")
            .optional(),
    })
        .required(),
})
    .required();
// 🎯 GET ORDER BY ID
const orderGetByIdSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, "ID must be a valid ObjectId.")
            .required("ID is required."),
    }),
})
    .required();
// 🎯 DELETE ORDER BY ID
const orderDeleteByIdSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, "ID must be a valid ObjectId.")
            .required("ID is required."),
    }),
})
    .required();
exports.default = {
    orderCreateSchema,
    orderUpdateSchema,
    orderGetByIdSchema,
    orderDeleteByIdSchema,
};
//# sourceMappingURL=orders.validation.js.map