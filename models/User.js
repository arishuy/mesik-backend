import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import MongooseDelete from "mongoose-delete";
import { roles } from "../config/constant.js";

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    gender: Boolean,
    phone: String,
    photo_url: String,
    photo_public_id: String,
    DoB: Date,
    email: { type: String, required: true, index: true },
    username: { type: String, index: true },
    encrypted_password: String,
    reset_password: String,
    history_listen: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    liked_songs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Song", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Artist", default: [] },
    ],
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },
    isRestricted: { type: Boolean, default: false },
    isConfirmed: { type: Boolean, default: false },
    providers: { type: [String], default: [] },
    balance: { type: Number, min: 0, default: 0 },
    lastLoginTime: { type: Date, default: () => Date.now() },

    // Thêm trường cho gói dịch vụ Premium
    premiumStartDate: {
      type: Date,
      default: null,
    }, // Thời điểm bắt đầu sử dụng gói dịch vụ Premium
    premiumEndDate: {
      type: Date,
      default: null,
    }, // Thời điểm kết thúc gói dịch vụ Premium
  },
  { collection: "users" }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const User = mongoose.model("User", userSchema);

export default User;
