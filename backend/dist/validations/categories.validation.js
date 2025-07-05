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
exports.default = {
    categoryCreateSchema,
    categoryUpdateSchema,
    categoryGetByIdSchema,
    categoryDeleteByIdSchema,
};
//# sourceMappingURL=categories.validation.js.map