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
exports.default = {
    brandCreateSchema,
    brandUpdateSchema,
    brandGetByIdSchema,
    brandDeleteByIdSchema,
};
//# sourceMappingURL=brands.validation.js.map