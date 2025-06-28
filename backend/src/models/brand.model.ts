import { model, Schema } from "mongoose";
const brandSchema = new Schema({
  name: { type: String, required: true, trim: true, maxLength: 255 },
  logo: { type: String,  trim: true, maxLength: 255 },
  country: { type: String, trim: true, maxLength: 100 },
  slug: { type: String, required: true, unique: true, trim: true, maxLength: 255 },
  
}, {
  timestamps: true,
  versionKey: false,
  collection: "brands"
});
export default model("Brand", brandSchema);
