import httpStatus from "http-status";
import {
  by_time,
  job_request_status,
  roles,
  transaction_status,
  transaction_types,
} from "../config/constant.js";
import {
  Album,
  ExpertInfo,
  Genre,
  JobRequest,
  Major,
  Playlist,
  Review,
  Song,
  Transaction,
  User,
} from "../models/index.js";
import ApiError from "../utils/ApiError.js";

const getStatisticsForAdmin = async () => {
  const [
    song_count,
    transaction_cancel_count,
    transaction_processing_count,
    transaction_done_count,
    artist_count,
    user_count,
    genre_count,
    album_count,
    playlist_count,
    total_deposit_amount,
  ] = await Promise.all([
    Song.count({}),
    Transaction.count({ transaction_status: transaction_status.CANCELED }),
    Transaction.count({ transaction_status: transaction_status.PROCESSING }),
    Transaction.count({ transaction_status: transaction_status.DONE }),
    User.count({ role: roles.ARTIST }),
    User.count({ role: roles.USER }),
    Genre.count({}),
    Album.count({}),
    Playlist.count({}),
    getTotalDepositAmount(),
  ]);

  return {
    song_count,
    transaction_cancel_count,
    transaction_processing_count,
    transaction_done_count,
    artist_count,
    user_count,
    genre_count,
    album_count,
    playlist_count,
    total_deposit_amount,
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
        transaction_type: transaction_types.BUY_PREMIUM,
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
