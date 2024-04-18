import mongoose from "mongoose";

const pushTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    collection: "push_token",
    timestamps: true,
  }
);

const PushToken = mongoose.model("PushToken", pushTokenSchema);

export default PushToken;
