"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderDetailSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    size: { type: String, enum: ["XS", "S", "M", "L", "XL"], required: false },
    color: { type: String, required: false },
}, {
    timestamps: true,
    versionKey: false,
    collection: "orderdetails",
});
exports.default = (0, mongoose_1.model)("OrderDetail", orderDetailSchema);
//# sourceMappingURL=orderDetail.model.js.map