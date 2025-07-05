import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["percent", "fixed"], required: true }, // "percent" hoặc "fixed"
    value: { type: Number, required: true }, // ví dụ: 10 hoặc 10000
    quantity: { type: Number }, // Tổng số lượng mã phát hành
    maxDiscount: { type: Number }, // số tiền giảm tối đa (nếu có)
    isActive: { type: Boolean, default: true },
    expiredAt: { type: Date }, // ngày hết hạn
  },
  {
    timestamps: true, // tự động thêm createdAt và updatedAt
    versionKey: false, // không sử dụng __v
  }
);

export default mongoose.model("Promotion", promotionSchema);
