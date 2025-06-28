import { model, Schema } from "mongoose";

const orderDetailSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },

    size: { type: String, enum: ["XS", "S", "M", "L", "XL"], required: false },
    color: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "orderdetails",
  }
);
export default model("OrderDetail", orderDetailSchema);
