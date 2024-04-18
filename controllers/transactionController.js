import transactionService from "../services/transactionService.js";
import pusherService from "../services/pusherService.js";
import dotenv from "dotenv";
import notificationService from "../services/notificationService.js";

const createDeposit = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { amount } = req.body;
    const transaction = await transactionService.createDeposit({
      user_id,
      amount,
    });

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const paymentUrl = transactionService.generatePaymentUrl({
      ipAddr,
      transaction_id: transaction._id,
      amount: transaction.amount,
    });
    res.json({ transaction, paymentUrl });
  } catch (error) {
    next(error);
  }
};

const vnpayReturn = async (req, res, next) => {
  try {
    await transactionService.handleVnpayReturn(req);
    res.redirect(process.env.DEPOSIT_REDIRECT_URL);
  } catch (error) {
    next(error);
  }
};

const vnpayIpn = async (req, res, next) => {
  try {
    await transactionService.vnpayIpn(req, res);
  } catch (error) {
    next(error);
  }
};

const createPayment = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { job_request_id } = req.body;
    const transaction = await transactionService.createPayment({
      user_id,
      job_request_id,
    });
    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

const executePayment = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { transaction_id } = req.params;
    const transaction = await transactionService.executePayment({
      user_id,
      transaction_id,
    });

    notificationService.notifyPayment(transaction_id);
    pusherService.updateBalance(transaction.user._id, transaction.user.balance);
    pusherService.updateBalance(
      transaction.expert._id,
      transaction.expert.balance
    );

    res.json({ transaction });
  } catch (error) {
    next(error);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    const { page, limit, date_from, date_to, transaction_status } = req.query;
    const transactions = await transactionService.fetchAllTransactions(
      page || 1,
      limit || 10,
      date_from,
      date_to,
      transaction_status
    );
    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};

export default {
  createDeposit,
  vnpayReturn,
  vnpayIpn,
  createPayment,
  executePayment,
  getAllTransactions,
};
