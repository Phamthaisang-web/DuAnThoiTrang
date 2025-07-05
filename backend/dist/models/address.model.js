"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// models/Address.ts
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    receiverName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    isDefault: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
    collection: "addresses",
});
exports.default = (0, mongoose_1.model)("Address", addressSchema);
//# sourceMappingURL=address.model.js.map