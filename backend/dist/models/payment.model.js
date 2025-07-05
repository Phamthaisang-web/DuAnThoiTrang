"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
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
            validator: function (value) {
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
}, {
    timestamps: true,
    versionKey: false,
    collection: "payments",
});
exports.default = (0, mongoose_1.model)("Payment", paymentSchema);
//# sourceMappingURL=payment.model.js.map