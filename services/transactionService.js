import { Transaction, User, JobRequest } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import {
  job_request_status,
  transaction_status,
  transaction_types,
} from "../config/constant.js";
import querystring from "qs";
import crypto from "crypto";
import moment from "moment";
import dotenv from "dotenv";
import { startSession } from "mongoose";
import pusherService from "./pusherService.js";

dotenv.config();

const createDeposit = async ({ user_id, amount }) => {
  const user = await User.findById(user_id).lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  const transaction = await Transaction.create({
    user: user_id,
    amount: amount,
    transaction_type: transaction_types.DEPOSIT,
    transaction_status: transaction_status.PROCESSING,
  });

  return transaction;
};

const createPayment = async ({ user_id, job_request_id }) => {
  const job_request = await JobRequest.findById(job_request_id)
    .populate([
      {
        path: "expert",
      },
    ])
    .lean();

  if (!job_request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request not found");
  }

  if (job_request.user.toString() !== user_id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payment");
  }

  if (job_request.status !== job_request_status.DONE) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This job is not done");
  }

  if (job_request.time_payment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This job is already paid");
  }

  const user = await User.findById(user_id).lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (user.balance < job_request.price) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  const transaction = await Transaction.create({
    user: user_id,
    expert: job_request.expert.user.toString(),
    job_request: job_request_id,
    amount: job_request.price,
    transaction_type: transaction_types.PAYMENT,
    transaction_status: transaction_status.PROCESSING,
  });

  return transaction.populate([
    {
      path: "user",
      select: "first_name last_name gender phone address photo_url email",
    },
    {
      path: "expert",
      select: "first_name last_name gender phone address photo_url email",
    },
    {
      path: "job_request",
      populate: {
        path: "major",
      },
    },
  ]);
};

const handleSuccessDeposit = async (transaction) => {
  const user = await User.findById(transaction.user);
  if (!user) return;
  if (transaction.transaction_status !== transaction_status.DONE) return;
  await user.updateOne({
    balance: user.balance + transaction.amount,
  });

  pusherService.updateBalance(user._id, user.balance + transaction.amount);
};

const executePayment = async ({ user_id, transaction_id }) => {
  const transaction = await Transaction.findById(transaction_id);
  if (!transaction) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Transaction not found");
  }
  if (transaction.user.toString() !== user_id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user");
  }
  if (transaction.transaction_status !== transaction_status.PROCESSING) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Can't execute this transaction"
    );
  }
  const job_request = await JobRequest.findById(transaction.job_request);
  if (!job_request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request not found");
  }
  if (job_request.time_payment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request already paid");
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

    const expert = await User.findByIdAndUpdate(
      transaction.expert,
      {
        $inc: { balance: transaction.amount },
      },
      {
        session,
        new: true,
      }
    );
    if (!expert) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
    }

    await session.commitTransaction();

    transaction.transaction_status = transaction_status.DONE;
    await transaction.save();

    await JobRequest.updateOne(
      { _id: transaction.job_request },
      { time_payment: Date.now() }
    );
    // cancel all duplicated transactions
    await Transaction.updateMany(
      { _id: { $ne: transaction._id }, job_request: transaction.job_request },
      { transaction_status: transaction_status.CANCELED }
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return await transaction.populate([
    {
      path: "user",
      select: "balance",
    },
    {
      path: "expert",
      select: "balance",
    },
  ]);
};

const fetchTransactionsByUserId = async (
  user_id,
  page = 1,
  limit = 10,
  date_from = null,
  date_to = null,
  transaction_status = null
) => {
  const query = {
    $or: [{ user: user_id }, { expert: user_id }],
  };

  if (date_from || date_to) {
    query.createdAt = {};
    if (date_from) {
      query.createdAt.$gte = new Date(date_from);
    }
    if (date_to) {
      query.createdAt.$lte = new Date(date_to);
    }
  }

  if (transaction_status) {
    query.transaction_status = transaction_status;
  }

  const pagination = await Transaction.paginate(query, {
    sort: { createdAt: -1 },
    populate: [
      {
        path: "user",
        select: "first_name last_name gender phone address photo_url email",
      },
      {
        path: "expert",
        select: "first_name last_name gender phone address photo_url email",
      },
      {
        path: "job_request",
        populate: {
          path: "major",
        },
      },
    ],
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "transactions",
    },
  });
  return pagination;
};

const generatePaymentUrl = ({
  ipAddr,
  transaction_id,
  amount,
  bankCode = null,
  language = null,
}) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let tmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;
  let vnpUrl = process.env.vnp_Url;
  let returnUrl = process.env.DOMAIN_NAME + process.env.vnp_ReturnUrl;

  let locale = language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = transaction_id;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + transaction_id;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

const handleVnpayReturn = async (req) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let tmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    let transaction_id = vnp_Params["vnp_TxnRef"];
    let amount = vnp_Params["vnp_Amount"] / 100;
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return { message: "Transaction not found" };
    }
    if (amount != transaction.amount) {
      return { message: "Amount not match" };
    }
    if (!(transaction.transaction_status == transaction_status.PROCESSING)) {
      return { message: "Transaction was done or canceled" };
    }
    // test
    transaction.transaction_status = transaction_status.DONE;
    await transaction.save();
    await handleSuccessDeposit(transaction);
    //
    return { message: "Transaction successful" };
  }

  return { message: "Error" };
};

const vnpayIpn = async (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let transaction_id = vnp_Params["vnp_TxnRef"];
  let amount = vnp_Params["vnp_Amount"] / 100;
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = process.env.vnp_HashSecret;
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  const transaction = await Transaction.findById(transaction_id).lean();

  let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (transaction) {
      if (transaction.amount === amount) {
        if (transaction.transaction_status === transaction_status.PROCESSING) {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == "00") {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            transaction.transaction_status = transaction_status.DONE;
            await transaction.save();
            await handleSuccessDeposit(transaction);
            res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            transaction.transaction_status = transaction_status.CANCELED;
            await transaction.save();
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};

const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

const fetchAllTransactions = async (
  page = 1,
  limit = 10,
  date_from = null,
  date_to = null,
  transaction_status = null
) => {
  const query = {};

  if (date_from || date_to) {
    query.createdAt = {};
    if (date_from) {
      query.createdAt.$gte = new Date(date_from);
    }
    if (date_to) {
      query.createdAt.$lte = new Date(date_to);
    }
  }

  if (transaction_status) {
    query.transaction_status = transaction_status;
  }

  const pagination = await Transaction.paginate(query, {
    sort: { createdAt: -1 },
    populate: [
      {
        path: "user",
        select: "first_name last_name gender phone address photo_url email",
      },
      {
        path: "expert",
        select: "first_name last_name gender phone address photo_url email",
      },
      {
        path: "job_request",
        populate: {
          path: "major",
        },
      },
    ],
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "transactions",
    },
  });
  return pagination;
};

export default {
  createDeposit,
  createPayment,
  fetchTransactionsByUserId,
  generatePaymentUrl,
  handleVnpayReturn,
  vnpayIpn,
  executePayment,
  fetchAllTransactions,
};
