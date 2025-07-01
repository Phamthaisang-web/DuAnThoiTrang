import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // Không dùng ref nữa, lưu dữ liệu address trực tiếp
    address: {
      receiverName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String },
      district: { type: String },
      ward: { type: String },
    },
    orderDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "orders",
  }
);

export default model("Order", orderSchema);
