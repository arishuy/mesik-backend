import httpStatus from "http-status";
import { User, BankAccount } from "../models/index.js";
import ApiError from "../utils/ApiError.js";

const updateBankAccount = async ({
  user_id,
  number,
  owner_name,
  bank_name,
}) => {
  const bank_account = await BankAccount.findOneAndUpdate(
    { user: user_id },
    {
      number,
      owner_name,
      bank_name,
    },
    {
      upsert: true,
      new: true,
    }
  );

  return bank_account;
};

const getBankAccountByUserId = async (user_id) => {
  const bank_account = await BankAccount.findOne({ user: user_id }).lean();
  return bank_account;
};

export default {
  getBankAccountByUserId,
  updateBankAccount,
};
