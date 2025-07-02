import { model, Schema, Document } from "mongoose";

export interface ITempUser extends Document {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: "user" | "admin";
  verificationCode: string;
  verificationCodeExpires: Date;
}

const tempUserSchema = new Schema<ITempUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verificationCode: { type: String, required: true },
    verificationCodeExpires: { type: Date, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "temp_users",
  }
);

export default model<ITempUser>("TempUser", tempUserSchema);
