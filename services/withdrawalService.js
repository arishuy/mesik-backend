import httpStatus from "http-status";
import { User, WithdrawalRequest, Transaction } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import { transaction_status, transaction_types } from "../config/constant.js";
import { startSession } from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const createWithdrawalRequest = async ({ user_id, amount, bank_account }) => {
    const user = User.findById(user_id)

    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    };

    if (user.balance < amount || amount <= 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Insufficent amount");
    };

    const transaction = await Transaction.create({
        user: user_id,
        amount: amount,
        transaction_type: transaction_types.WITHDRAWAL,
        transaction_status: transaction_status.PROCESSING,
        fee: amount * +process.env.WITHDRAW_FEE_PERCENT / 100
    })

    const request = await WithdrawalRequest.create({
        user: user_id,
        transaction: transaction,
        bank_account: bank_account,
    });

    return request;
}

const fetchWithdrawalRequests = async ({user_id = null, page = 1, limit = 10}) => {
    const query = {};
    if (user_id) {
        query.user = user_id
    }
    const pagination = await WithdrawalRequest.paginate(query,
        {
            sort: { createdAt: -1 },
            populate: [
                {
                    path: "user",
                    select: "first_name last_name photo_url",
                },
                {
                    path: "transaction",
                }
            ],
            page,
            limit,
            lean: true,
            customLabels: {
                docs: "withdrawal_requests",
            },
        })

    return pagination;
}

const fetchWithdrawalRequestById = async (withdrawal_request_id) => {
    const withdrawal_request = await WithdrawalRequest.findById(withdrawal_request_id)
        .populate([
            {
                path: "user",
                select: "first_name last_name phone address photo_url DoB email role balance",
            },
            {
                path: "transaction",
            }
        ]);

    return withdrawal_request;
}

const fulfillWithdrawalRequest = async (withdrawal_request_id) => {
    const withdrawal_request = await WithdrawalRequest.findById(withdrawal_request_id);
    if (!withdrawal_request) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Request not found");
    }

    const transaction = await Transaction.findById(withdrawal_request.transaction);
    if (!transaction) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Transaction not found");
    }
    if (transaction.transaction_status !== transaction_status.PROCESSING) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Can't execute this transaction"
        );
    }

    const session = await startSession();
    try {
        // start transaction
        session.startTransaction();
        const user = await User.findByIdAndUpdate(
            transaction.user,
            {
                $inc: { balance: -transaction.amount },
            },
            {
                session,
                new: true,
            }
        );

        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
        }
        if (user.balance < 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
        }

        await session.commitTransaction();

        transaction.transaction_status = transaction_status.DONE;
        await transaction.save();

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }

    return fetchWithdrawalRequestById(withdrawal_request_id);
}

const cancelWithdrawalRequest = async (withdrawal_request_id) => {
    const withdrawal_request = await WithdrawalRequest.findById(withdrawal_request_id)
        .populate("transaction");
    if (!withdrawal_request) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Request not found");
    }
    if(withdrawal_request.transaction.transaction_status !== transaction_status.PROCESSING) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Request not processing");
    }
    await Transaction.findByIdAndUpdate(withdrawal_request.transaction, { transaction_status: transaction_status.CANCELED });
    return fetchWithdrawalRequestById(withdrawal_request_id);
}

export default {
    createWithdrawalRequest,
    fetchWithdrawalRequests,
    fetchWithdrawalRequestById,
    fulfillWithdrawalRequest,
    cancelWithdrawalRequest
}