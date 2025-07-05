import { model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    paymentDate: { type: Date, default: Date.now },
    amount: { type: Number, required: true, min: 0 },

    method: {
      type: String,
      required: true,
      enum: ["bank_transfer", "cash"],
      maxlength: 100,
    },

    // ✅ Chỉ required nếu là chuyển khoản
    transferCode: {
      type: String,
      index: true,
      validate: {
        validator: function (this: any, value: string) {
          // Nếu là bank_transfer thì phải có transferCode
          if (this.method === "bank_transfer") {
            return !!value; // phải có giá trị
          }
          return true; // nếu là cash thì không bắt buộc
        },
        message: "Chuyển khoản phải có mã chuyển khoản (transferCode)",
      },
    },
    // ✅ Thêm trạng thái thanh toán
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed"],
      default: "pending",
    },
    // ✅ Ghi chú tùy chọn
    note: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "payments",
  }
);

export default model("Payment", paymentSchema);
