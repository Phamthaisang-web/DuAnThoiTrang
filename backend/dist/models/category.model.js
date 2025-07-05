"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxLength: 255 },
    description: { type: String, trim: true, maxLength: 500, default: "" },
    slug: { type: String, required: true, unique: true, trim: true, maxLength: 255 },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", default: null }
}, {
    timestamps: true,
    versionKey: false,
    collection: "categories"
});
exports.default = (0, mongoose_1.model)("Category", categorySchema);
//# sourceMappingURL=category.model.js.map