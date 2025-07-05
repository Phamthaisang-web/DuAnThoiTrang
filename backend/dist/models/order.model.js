"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
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
        enum: [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "return_requested", // thêm
            "returned",
        ],
        default: "pending",
    },
    totalAmount: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
    versionKey: false,
    collection: "orders",
});
exports.default = (0, mongoose_1.model)("Order", orderSchema);
//# sourceMappingURL=order.model.js.map