"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tempUserSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verificationCode: { type: String, required: true },
    verificationCodeExpires: { type: Date, required: true },
}, {
    timestamps: true,
    versionKey: false,
    collection: "temp_users",
});
exports.default = (0, mongoose_1.model)("TempUser", tempUserSchema);
//# sourceMappingURL=tempOtp.model.js.map