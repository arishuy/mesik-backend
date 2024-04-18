import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
      unique: true,
    },
    number: { type: String, default: "" },
    owner_name: { type: String, default: "" },
    bank_name: { type: String, default: "" },
  },
  { collection: "bank_account" }
);

const BankAccount = mongoose.model("BankAccount", bankAccountSchema);

export default BankAccount;
