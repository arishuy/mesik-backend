import httpStatus from "http-status";
import { Review, User, ExpertInfo, JobRequest } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import { job_request_status } from "../config/constant.js";
import mongoose from "mongoose";

const createReview = async ({ user_id, job_request_id, rating, comment }) => {
  const job_request = await JobRequest.findById(job_request_id).lean();
  if (!job_request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job not found");
  }
  if (job_request.user.toString() !== user_id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You are not the owner");
  }
  // TODO: check booking status
  if (job_request.status !== job_request_status.DONE) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job hasn't been done");
  }

  if (await Review.exists({ user: user_id, job_request: job_request_id })) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already reviewed this job");
  }

  // update expert's rating
  const expert = await ExpertInfo.findById(job_request.expert);
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }
  await expert.updateOne({
    rating_count: expert.rating_count + 1,
    average_rating:
      (expert.average_rating * expert.rating_count + rating) /
      (expert.rating_count + 1),
  });

  const review = await Review.create({
    user: user_id,
    expert: expert._id,
    job_request: job_request_id,
    rating: rating,
    comment: comment,
  });
  await JobRequest.updateOne({ _id: job_request._id }, { is_reviewed: true });
  return review;
};

const fetchReviewsPaginationByExpertId = async (
  expert_id,
  page = 1,
  limit = 10
) => {
  const pagination = await Review.paginate(
    { expert: expert_id },
    {
      sort: { createdAt: -1 },
      populate: [
        {
          path: "user",
          select: "first_name last_name photo_url",
        },
      ],
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "reviews",
      },
    }
  );
  return pagination;
};

const fetchReviewByJobRequestId = async (job_request_id) => {
  const review = await Review.findOne({
    job_request: job_request_id,
  })
    .populate([
      {
        path: "user",
        select: "first_name last_name photo_url",
      },
      {
        path: "expert",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
    ])
    .lean();
  return review;
};

export default {
  createReview,
  fetchReviewsPaginationByExpertId,
  fetchReviewByJobRequestId,
};
