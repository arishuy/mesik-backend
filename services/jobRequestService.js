import httpStatus from "http-status";
import {
  ExpertInfo,
  JobRequest,
  Major,
  User,
  RecommendedExperts,
} from "../models/index.js";
import { job_request_status } from "../config/constant.js";
import recommendedExpertsService from "./recommendedExpertsService.js";
import ApiError from "../utils/ApiError.js";
import moment from "moment";
import dotenv from "dotenv";
import transactionService from "./transactionService.js";

dotenv.config();

const createJobRequest = async ({
  user_id,
  major_id,
  title,
  descriptions,
  address,
  price,
}) => {
  const user = await User.findById(user_id).lean();
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  if (!(await Major.findById(major_id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Major not found");
  }
  // TODO: check user's balance
  const remain_balance =
    user.balance -
    (await getTotalPriceOfAvailableJobsByUserId(user_id)) -
    price;

  if (remain_balance < 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Insufficent balance. Need more: ${-remain_balance}`
    );
  }

  const jobRequest = await JobRequest.create({
    user: user_id,
    major: major_id,
    title,
    descriptions,
    address,
    price,
    status: job_request_status.PENDING,
  });

  return jobRequest;
};

const getTotalPriceOfAvailableJobsByUserId = async (user_id) => {
  const result = await JobRequest.aggregate([
    {
      $project: {
        user: 1,
        price: 1,
        status: 1,
      },
    },
    {
      $match: {
        user: user_id,
        $or: [
          { status: job_request_status.PENDING },
          { status: job_request_status.PROCESSING },
          {
            $and: [
              { status: job_request_status.DONE },
              { time_payment: { $exists: false } },
            ],
          },
        ],
      },
    },
    {
      $group: {
        _id: 0,
        price: {
          $sum: "$price",
        },
      },
    },
  ]).exec();

  return result[0] ? result[0].price : 0;
};

const fetchJobRequestsPagination = async (
  page = 1,
  limit = 10,
  major_id = null
) => {
  let query = {};
  if (major_id) query.major = major_id;
  const pagination = await JobRequest.paginate(query, {
    populate: [
      {
        path: "user",
        select: "first_name last_name photo_url",
      },
      {
        path: "major",
      },
    ],
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "job_requests",
    },
  });
  return pagination;
};

const fetchJobRequestById = async (job_request_id) => {
  const jobRequest = await JobRequest.findById(job_request_id).populate([
    {
      path: "user",
      select: "first_name last_name photo_url phone gender email address",
    },
    {
      path: "major",
    },
    {
      path: "expert",
      populate: {
        path: "user",
        select: "first_name last_name gender photo_url phone address email",
      },
    },
  ]);
  if (!jobRequest) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request not found");
  }
  return jobRequest;
};

const fetchJobRequestsPaginationByUserId = async (
  user_id,
  page = 1,
  limit = 10,
  major_id = null
) => {
  let query = { user: user_id };
  if (major_id) query.major = major_id;
  const pagination = await JobRequest.paginate(query, {
    populate: [
      {
        path: "user",
        select: "first_name last_name photo_url",
      },
      {
        path: "major",
      },
    ],
    sort: { createdAt: -1 },
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "job_requests",
    },
  });
  return pagination;
};

const acceptJobRequestByExpert = async ({ user_id, job_request_id }) => {
  const expert = await ExpertInfo.findOne({ user: user_id }).lean();
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }

  if (
    (await countExpertJobsToday(expert._id)) >
    parseInt(process.env.MAX_JOB_PER_EXPERT_PER_DAY)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't accept more job today"
    );
  }

  const job_request = await JobRequest.findById(job_request_id);
  if (!job_request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request not found");
  }
  if (job_request.status !== job_request_status.PENDING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This job is not available");
  }
  const recommended_experts = await RecommendedExperts.findOne({job_request: job_request_id});
  if(!recommended_experts || !recommended_experts.experts.map(e => e.toString()).includes(expert._id.toString())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You can't accept this job");
  }

  job_request.expert = expert._id;
  job_request.status = job_request_status.PROCESSING;
  job_request.time_booking = new Date();
  await job_request.save();
  return job_request;
};

const cancelJobRequestByExpert = async ({ user_id, job_request_id }) => {
  const expert = await ExpertInfo.findOne({ user: user_id }).lean();
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }
  const job_request = await JobRequest.findById(job_request_id);
  if (!job_request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request not found");
  }
  if (job_request.status !== job_request_status.PROCESSING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't cancel this job");
  }
  if (job_request.expert.toString() !== expert._id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't cancel this job");
  }
  job_request.status = job_request_status.CANCELED;
  await job_request.save();
  return job_request;
};

const deleteRecommendedJobRequest = async ({ user_id, job_request_id }) => {
  const expert = await ExpertInfo.findOne({ user: user_id }).lean();
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }
  await RecommendedExperts.findOneAndUpdate(
    { job_request: job_request_id },
    { $pull: { experts: expert._id } }
  );
};

const updateJobRequest = async ({
  user_id,
  job_request_id,
  major_id,
  title,
  descriptions,
  address,
  price,
}) => {
  const job_request = await JobRequest.findById(job_request_id);
  if (!job_request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request not found");
  }
  if (job_request.user.toString() !== user_id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You are not the owner");
  }
  if (job_request.status !== job_request_status.PENDING) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can't modify this job request");
  }
  if (major_id && !(await Major.findById(major_id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Major not found");
  }
  job_request.major = major_id || job_request.major;
  job_request.title = title || job_request.title;
  job_request.descriptions = descriptions || job_request.descriptions;
  job_request.address = address || job_request.address;
  job_request.price = price || job_request.price;
  await job_request.save();
  return job_request;
};

const fetchAcceptedJobRequestsByExpertId = async (
  expert_id,
  page = 1,
  limit = 10,
  major_id = null
) => {
  let query = {
    expert: expert_id,
  };
  if (major_id) query.major = major_id;
  const pagination = await JobRequest.paginate(query, {
    sort: { createdAt: -1 },
    populate: [
      {
        path: "user",
        select: "first_name last_name photo_url email phone",
      },
      {
        path: "major",
      },
    ],
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "job_requests",
    },
  });
  return pagination;
};

const completeJobRequest = async ({ user_id, job_request_id }) => {
  const job_request = await JobRequest.findById(job_request_id);
  if (job_request.user.toString() !== user_id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You are not the owner");
  }
  if (job_request.status === job_request_status.DONE) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "This job request is already done"
    );
  }
  if (job_request.status !== job_request_status.PROCESSING) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Can't complete this job request"
    );
  }
  job_request.status = job_request_status.DONE;
  await job_request.save();
  return job_request;
};

const completeJobRequestAndPayment = async ({ user_id, job_request_id }) => {
  try {
    const job_request = await completeJobRequest({ user_id, job_request_id });
    let transaction = await transactionService.createPayment({
      user_id,
      job_request_id,
    });
    transaction = await transactionService.executePayment({
      user_id,
      transaction_id: transaction._id,
    });
    return { job_request, transaction };
  } catch (error) {
    throw error;
  }
};

const deleteJobRequest = async ({ user_id, job_request_id }) => {
  const job_request = await JobRequest.findById(job_request_id);
  if (job_request.user.toString() !== user_id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You are not the owner");
  }
  if (job_request.status !== job_request_status.PENDING) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Can not delete this job request"
    );
  }

  await JobRequest.deleteOne({ _id: job_request_id, user: user_id });
};

const countExpertJobsToday = async (expert_id) => {
  const startOfToday = moment().utc().startOf("day").toDate();
  const endOfToday = moment().utc().endOf("day").toDate();

  const count = await JobRequest.count({
    expert: expert_id,
    time_booking: { $gte: startOfToday, $lte: endOfToday },
  });

  return count;
};

export default {
  createJobRequest,
  fetchJobRequestsPagination,
  fetchJobRequestById,
  fetchJobRequestsPaginationByUserId,
  acceptJobRequestByExpert,
  updateJobRequest,
  cancelJobRequestByExpert,
  fetchAcceptedJobRequestsByExpertId,
  deleteRecommendedJobRequest,
  completeJobRequest,
  completeJobRequestAndPayment,
  deleteJobRequest,
};
