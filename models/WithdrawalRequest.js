import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { transaction_status } from "../config/constant.js";

const withdrawalRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", index: true },
    transaction: { type: mongoose.Schema.ObjectId, ref: "Transaction", index: true },
    bank_account: {
        type: {
            number: {type: String, required: true},
            owner_name: {type: String, required: true},
            bank_name: {type: String, required: true},
        },
        required: true,
    },
  },
  {
    collection: "withdrawal_request",
    timestamps: true,
  }
);

withdrawalRequestSchema.plugin(mongoosePaginate);

const WithdrawalRequest = mongoose.model("WithdrawalRequest", withdrawalRequestSchema);

export default WithdrawalRequest;
