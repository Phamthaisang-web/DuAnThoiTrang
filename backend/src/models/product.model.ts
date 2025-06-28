import { model, Schema } from "mongoose";
const productSchema = new Schema(
  {
    name: { type: String, trim: true, maxLength: 100 },
    description: { type: String, trim: true, maxLength: 500, default: "" },
    price: { type: Number, required: true, min: 0 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 255,
    },
    sizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL"] }],
    colors: [{ type: String }],
    stockQuantity: { type: Number, required: true, min: 0 },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, trim: true, maxLength: 100 },
      },
    ],
    category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "products",
  }
);

export default model("Product", productSchema);
