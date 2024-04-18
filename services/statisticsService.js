import httpStatus from "http-status";
import {
  by_time,
  job_request_status,
  roles,
  transaction_status,
  transaction_types,
} from "../config/constant.js";
import {
  ExpertInfo,
  JobRequest,
  Major,
  Review,
  Transaction,
  User,
} from "../models/index.js";
import ApiError from "../utils/ApiError.js";

const getStatisticsForAdmin = async () => {
  const [
    job_request_count,
    job_request_pending_count,
    job_request_processing_count,
    job_request_done_count,
    job_request_canceled_count,
    expert_count,
    user_count,
    major_count,
    reviews,
    total_deposit_amount,
  ] = await Promise.all([
    JobRequest.count({}),
    JobRequest.count({ status: job_request_status.PENDING }),
    JobRequest.count({ status: job_request_status.PROCESSING }),
    JobRequest.count({ status: job_request_status.DONE }),
    JobRequest.count({ status: job_request_status.CANCELED }),
    User.count({ role: roles.EXPERT }),
    User.count({ role: roles.USER }),
    Major.count({}),
    Review.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate([
        {
          path: "user",
          select: "first_name last_name photo_url",
        },
        {
          path: "expert",
          select: "user",
          populate: {
            path: "user",
            select: "first_name last_name photo_url",
          },
        },
      ])
      .lean(),
    getTotalDepositAmount(),
  ]);

  return {
    job_request_count,
    job_request_pending_count,
    job_request_processing_count,
    job_request_done_count,
    job_request_canceled_count,
    expert_count,
    user_count,
    major_count,
    total_deposit_amount,
    reviews,
  };
};

const getStatisticsForExpert = async (user_id) => {
  const expert = await ExpertInfo.findOne({ user: user_id });
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }

  const [
    job_request_processing_count,
    job_request_done_count,
    job_request_canceled_count,
    reviews,
  ] = await Promise.all([
    JobRequest.count({
      expert: expert._id,
      status: job_request_status.PROCESSING,
    }),
    JobRequest.count({ expert: expert._id, status: job_request_status.DONE }),
    JobRequest.count({
      expert: expert._id,
      status: job_request_status.CANCELED,
    }),
    Review.find({ expert: expert._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate([
        {
          path: "user",
          select: "first_name last_name photo_url",
        },
        {
          path: "expert",
          select: "user",
          populate: {
            path: "user",
            select: "first_name last_name photo_url",
          },
        },
      ])
      .lean(),
  ]);

  return {
    job_request_processing_count,
    job_request_done_count,
    job_request_canceled_count,
    reviews,
  };
};

const getTotalDepositAmount = async () => {
  const result = await Transaction.aggregate([
    {
      $match: {
        transaction_type: transaction_types.DEPOSIT,
        transaction_status: transaction_status.DONE,
      },
    },
    {
      $group: { _id: null, amount: { $sum: "$amount" } },
    },
  ]).exec();

  return result[0] ? result[0].amount : 0;
};

const getIncomeForExpert = async ({
  expert_id = null,
  start_date = null,
  end_date = null,
  by = by_time.day,
}) => {
  const match = {
    transaction_type: transaction_types.PAYMENT,
    transaction_status: transaction_status.DONE,
  };
  if (expert_id) {
    match.expert = expert_id;
  }

  if (start_date || end_date) {
    match.createdAt = {};
    if (start_date) {
      match.createdAt.$gte = new Date(start_date);
    }
    if (end_date) {
      match.createdAt.$lt = new Date(end_date);
    }
  }

  const date_parts = {};

  if (by === by_time.year || by === by_time.month || by === by_time.day) {
    date_parts.year = { $year: "$createdAt" };
  }

  if (by === by_time.month || by === by_time.day) {
    date_parts.month = { $month: "$createdAt" };
  }

  if (by === by_time.day) {
    date_parts.day = { $dayOfMonth: "$createdAt" };
  }

  const proj = {
    $project: {
      _id: 0,
      amount: 1,
      date: {
        $dateFromParts: date_parts,
      },
    },
  };

  const group = {
    $group: {
      _id: "$date",
      amount: {
        $sum: "$amount",
      },
    },
  };

  const result = await Transaction.aggregate([
    { $match: match },
    proj,
    group,
    { $sort: { _id: 1 } },
  ]).exec();

  return result;
};

export default {
  getStatisticsForAdmin,
  getStatisticsForExpert,
  getIncomeForExpert,
};
