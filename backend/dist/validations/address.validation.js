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
const objectId = yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "ID must be a valid ObjectId")
    .required("ID is required");
// Tạo địa chỉ mới
const create = yup
    .object({
    body: yup.object({
        receiverName: yup
            .string()
            .required("Receiver name is required")
            .min(2, "Receiver name must be at least 2 characters"),
        phone: yup
            .string()
            .required("Phone is required")
            .matches(/^\d{10,11}$/, "Phone number must be 10–11 digits"),
        addressLine: yup
            .string()
            .required("Address line is required")
            .max(255, "Address line cannot exceed 255 characters"),
        city: yup.string().optional().max(100),
        district: yup.string().optional().max(100),
        ward: yup.string().optional().max(100),
        isDefault: yup.boolean().optional(),
    }),
})
    .required();
// Cập nhật địa chỉ
const update = yup
    .object({
    params: yup.object({
        id: objectId,
    }),
    body: yup.object({
        receiverName: yup.string().min(2).max(255).optional(),
        phone: yup
            .string()
            .matches(/^\d{10,11}$/, "Phone number must be 10–11 digits")
            .optional(),
        addressLine: yup.string().max(255).optional(),
        city: yup.string().optional().max(100),
        district: yup.string().optional().max(100),
        ward: yup.string().optional().max(100),
        isDefault: yup.boolean().optional(),
    }),
})
    .required();
// Lấy/Xoá theo ID
const getById = yup
    .object({
    params: yup.object({
        id: objectId,
    }),
})
    .required();
const deleteById = yup
    .object({
    params: yup.object({
        id: objectId,
    }),
})
    .required();
exports.default = {
    create,
    update,
    getById,
    deleteById,
};
//# sourceMappingURL=address.validation.js.map