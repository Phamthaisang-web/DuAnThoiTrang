import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true, min: 0 },
  method: {
      type: String,
      required: true,
      enum: ["bank_transfer", "cash"],
      maxlength: 100,
    },
}, {
  timestamps: true,
  versionKey: false,
  collection: "payments"
});
export default model("Payment", paymentSchema);