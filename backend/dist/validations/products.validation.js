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
const productCreateSchema = yup
    .object({
    body: yup.object({
        name: yup
            .string()
            .min(3, "Name must be at least 3 characters long.")
            .max(100, "Name must not exceed 100 characters.")
            .required("Name is required."),
        description: yup
            .string()
            .max(500, "Description must not exceed 500 characters.")
            .optional(),
        price: yup
            .number()
            .min(0, "Price must be at least 0.")
            .required("Price is required."),
        stockQuantity: yup
            .number()
            .min(0, "Stock quantity must be at least 0.")
            .required("Stock quantity is required."),
        sizes: yup
            .array()
            .of(yup.string().oneOf(["XS", "S", "M", "L", "XL"]))
            .optional(),
        colors: yup
            .array()
            .of(yup.string().trim().min(1, "Color cannot be empty."))
            .optional(),
        categories: yup
            .array()
            .of(yup.string().matches(objectIdRegex, {
            message: "Each category ID must be a valid ObjectId.",
        }))
            .optional(),
        brand: yup
            .string()
            .matches(objectIdRegex, {
            message: "Brand ID must be a valid ObjectId.",
        })
            .optional(),
    }),
})
    .required();
const productUpdateSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, {
            message: "Product ID must be a valid ObjectId.",
        })
            .required("Product ID is required."),
    }),
    body: yup.object({
        name: yup.string().min(3).max(100).optional(),
        description: yup.string().max(500).optional(),
        price: yup.number().min(0).optional(),
        stockQuantity: yup.number().min(0).optional(),
        sizes: yup
            .array()
            .of(yup.string().oneOf(["XS", "S", "M", "L", "XL"]))
            .optional(),
        colors: yup.array().of(yup.string().trim().min(1)).optional(),
        categories: yup
            .array()
            .of(yup.string().matches(objectIdRegex, {
            message: "Each category ID must be a valid ObjectId.",
        }))
            .optional(),
        brand: yup
            .string()
            .matches(objectIdRegex, {
            message: "Brand ID must be a valid ObjectId.",
        })
            .optional(),
    }),
})
    .required();
const productGetByIdSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, {
            message: "Product ID must be a valid ObjectId.",
        })
            .required("Product ID is required."),
    }),
})
    .required();
const productDeleteByIdSchema = yup
    .object({
    params: yup.object({
        id: yup
            .string()
            .matches(objectIdRegex, {
            message: "Product ID must be a valid ObjectId.",
        })
            .required("Product ID is required."),
    }),
})
    .required();
exports.default = {
    productCreateSchema,
    productUpdateSchema,
    productGetByIdSchema,
    productDeleteByIdSchema,
};
//# sourceMappingURL=products.validation.js.map