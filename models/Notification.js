import mongoose from "mongoose";
import { notification_types } from "../config/constant.js";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(notification_types),
    },
    is_seen: { type: Boolean, default: false },
    ref: {
      type: {},
      default: {},
    },
  },
  {
    collection: "notification",
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
