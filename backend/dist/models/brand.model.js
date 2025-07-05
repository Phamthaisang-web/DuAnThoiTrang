"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxLength: 255 },
    logo: { type: String, trim: true, maxLength: 255 },
    country: { type: String, trim: true, maxLength: 100 },
    slug: { type: String, required: true, unique: true, trim: true, maxLength: 255 },
}, {
    timestamps: true,
    versionKey: false,
    collection: "brands"
});
exports.default = (0, mongoose_1.model)("Brand", brandSchema);
//# sourceMappingURL=brand.model.js.map