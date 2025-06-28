import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
const saltRounds = 10;
const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true, maxLength: 255 },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          );
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email!`,
      },
    },
    password: { type: String, required: true, maxLength: 255 },
    phone: { type: String, maxLength: 20 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    collection: "users",
  }
);

//Middleware pre save ở lớp database
//trước khi data được lưu xuống --> mã hóa mật khẩu
userSchema.pre("save", async function (next) {
  const staff = this;

  const hash = bcrypt.hashSync(staff.password, saltRounds);

  staff.password = hash;

  next();
});
export default model("User", userSchema);
