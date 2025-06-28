// models/Address.ts
import { Schema, model, Types } from "mongoose";

const addressSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    receiverName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "addresses",
  }
);

export default model("Address", addressSchema);
