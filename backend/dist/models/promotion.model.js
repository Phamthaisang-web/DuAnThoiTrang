"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const promotionSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["percent", "fixed"], required: true }, // "percent" hoặc "fixed"
    value: { type: Number, required: true }, // ví dụ: 10 hoặc 10000
    quantity: { type: Number }, // Tổng số lượng mã phát hành
    maxDiscount: { type: Number }, // số tiền giảm tối đa (nếu có)
    isActive: { type: Boolean, default: true },
    expiredAt: { type: Date }, // ngày hết hạn
}, {
    timestamps: true, // tự động thêm createdAt và updatedAt
    versionKey: false, // không sử dụng __v
});
exports.default = mongoose_1.default.model("Promotion", promotionSchema);
//# sourceMappingURL=promotion.model.js.map