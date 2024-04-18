import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { transaction_types, transaction_status } from "../config/constant.js";
import { number } from "yup";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", index: true },
    expert: { type: mongoose.Schema.ObjectId, ref: "User", index: true },
    job_request: { type: mongoose.Schema.ObjectId, ref: "JobRequest" },
    amount: { type: Number, min: 0 },
    transaction_type: {
      type: String,
      enum: Object.values(transaction_types),
    },
    transaction_status: {
      type: String,
      enum: Object.values(transaction_status),
      default: transaction_status.PROCESSING,
    },
    fee: { type: Number, default: 0 },
  },
  {
    collection: "transactions",
    timestamps: true,
  }
);

transactionSchema.plugin(mongoosePaginate);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
