import mongoose from "mongoose";

const confirmationTokenSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.ObjectId, ref: "User" },
    token: { type: String, index: true },
    confirm_at: Date,
    confirmation_sent_at: Date,
  },
  { collection: "confirmation_token" }
);

const ConfirmationToken = mongoose.model(
  "ConfirmationToken",
  confirmationTokenSchema
);
export default ConfirmationToken;
