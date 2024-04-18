import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  login_time: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    required: true,
    index: true,
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
