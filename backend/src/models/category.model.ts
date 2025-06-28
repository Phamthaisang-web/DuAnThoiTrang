import { model, Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true, maxLength: 255 },
  description: { type: String, trim: true, maxLength: 500, default: "" },
  slug: { type: String, required: true, unique: true, trim: true, maxLength: 255 },
  parent: { type: Schema.Types.ObjectId, ref: "Category", default: null } 
}, {
  timestamps: true,
  versionKey: false,
  collection: "categories"
});


export default model("Category", categorySchema);
