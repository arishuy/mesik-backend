import httpStatus from "http-status";
import {
  ExpertInfo,
  Certificate,
  User,
  RecommendedExperts,
  JobRequest,
  Major,
} from "../models/index.js";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { job_request_status } from "../config/constant.js";

const fetchExpertsPagination = async ({
  page = 1,
  limit = 10,
  isFull = false,
  search = null,
  major_id = null,
}) => {
  let select = "first_name last_name gender photo_url";
  if (isFull) {
    select += " phone address DoB email username role isRestricted isConfirmed";
  }

  const pipeline = [
    {
      $lookup: {
        from: User.collection.name,
        localField: "user",
        foreignField: "_id",
        pipeline: [
          {
            $project: select.split(" ").reduce(
              (acc, curr) => {
                return { ...acc, [curr]: 1 };
              },
              { _id: 1 }
            ),
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$user.first_name", " ", "$user.last_name"] },
            regex: new RegExp(search),
            options: "i",
          },
        },
      },
    });
  }

  if (major_id) {
    pipeline.push(
      {
        $lookup: {
          from: Certificate.collection.name,
          localField: "certificates",
          foreignField: "_id",
          as: "certificates",
        },
      },
      {
        $unwind: "$certificates",
      },
      {
        $match: {
          "certificates.major": new mongoose.Types.ObjectId(major_id),
          "certificates.isVerified": true,
        },
      },
      {
        $group: {
          _id: "$_id",
          user: { $first: "$user" },
          descriptions: { $first: "$descriptions" },
          average_rating: { $first: "$average_rating" },
          rating_count: { $first: "$rating_count" },
          certificates: { $push: "$certificates" },
        },
      }
    );
  }

  const aggregate = ExpertInfo.aggregate(pipeline);

  const pagination = await ExpertInfo.aggregatePaginate(aggregate, {
    sort: { _id: 1 },
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "experts",
    },
  });
  return pagination;
};

const fetchExpertById = async (expert_id, isFull = false) => {
  let select = "first_name last_name gender photo_url";
  if (isFull) {
    select += " phone address DoB email username role isRestricted isConfirmed";
  }
  const expert = await ExpertInfo.findById(expert_id)
    .populate("user", select)
    .populate({
      path: "certificates",
      populate: {
        path: "major",
      },
    })
    .lean();
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }
  return expert;
};

const fetchExpertByUserId = async (user_id, isFull = false) => {
  let select = "first_name last_name gender photo_url";
  if (isFull) {
    select += " phone address DoB email username role isRestricted isConfirmed";
  }
  const expert = await ExpertInfo.findOne({ user: user_id })
    .populate("user", select)
    .populate({
      path: "certificates",
      populate: {
        path: "major",
      },
    })
    .lean();
  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }
  return expert;
};

const fetchCertificatesByExpertId = async (expert_id) => {
  const expert = await ExpertInfo.findById(expert_id, {
    select: "certificates",
  })
    .populate({
      path: "certificates",
      populate: {
        path: "major",
      },
    })
    .lean();
  return expert.certificates;
};

const fetchUnverifiedCertificatesByExpertId = async (expert_id) => {
  const expert = await ExpertInfo.findById(expert_id)
    .populate({ path: "certificates", match: { isVerified: false } })
    .lean();
  return expert.certificates;
};

const fetchVerifiedMajorsByExpertId = async (expert_id) => {
  const expert = await ExpertInfo.findById(expert_id, {
    select: "verified_majors",
  }).populate({
    path: "verified_majors",
  });

  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }

  return expert.verified_majors;
};

const fetchVerifiedMajorsByUserId = async (user_id) => {
  const expert = await ExpertInfo.findOne(
    { user: user_id },
    {
      select: "verified_majors",
    }
  ).populate({
    path: "verified_majors",
  });

  if (!expert) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Expert not found");
  }

  return expert.verified_majors;
};

const fetchExpertsHavingUnverifiedCert = async (
  search = null,
  page = 1,
  limit = 10
) => {
  const pipeline = [
    {
      $lookup: {
        from: Certificate.collection.name,
        localField: "certificates",
        foreignField: "_id",
        as: "certificates",
        pipeline: [
          {
            $lookup: {
              from: Major.collection.name,
              localField: "major",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    name: 1,
                  },
                },
              ],
              as: "major",
            },
          },
          {
            $unwind: "$major",
          },
        ],
      },
    },
    {
      $unwind: "$certificates",
    },
    {
      $match: { "certificates.isVerified": false },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        descriptions: { $first: "$descriptions" },
        average_rating: { $first: "$average_rating" },
        rating_count: { $first: "$rating_count" },
        certificates: { $push: "$certificates" },
      },
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "user",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              gender: 1,
              phone: 1,
              address: 1,
              photo_url: 1,
              DoB: 1,
              email: 1,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $expr: {
          $regexMatch: {
            input: { $concat: ["$user.first_name", " ", "$user.last_name"] },
            regex: new RegExp(search),
            options: "i",
          },
        },
      },
    });
  }

  const aggregate = ExpertInfo.aggregate(pipeline);

  const pagination = await ExpertInfo.aggregatePaginate(aggregate, {
    sort: { _id: 1 },
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "experts",
    },
  });
  return pagination;
};

const fetchRecommendedJobRequestsByExpertId = async (
  expert_id,
  page = 1,
  limit = 10,
  major_id = null
) => {
  const aggregate = RecommendedExperts.aggregate([
    {
      $match: {
        experts: expert_id,
      },
    },
    {
      $lookup: {
        from: JobRequest.collection.name,
        localField: "job_request",
        foreignField: "_id",
        as: "job_request",
        pipeline: [
          {
            $match: {
              status: job_request_status.PENDING,
              major: major_id
                ? new mongoose.Types.ObjectId(major_id)
                : { $exists: true },
            },
          },
          {
            $lookup: {
              from: User.collection.name,
              localField: "user",
              foreignField: "_id",
              as: "user",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    gender: 1,
                    phone: 1,
                    photo_url: 1,
                    email: 1,
                  },
                },
              ],
            },
          },
          { $unwind: "$user" },
          {
            $lookup: {
              from: Major.collection.name,
              localField: "major",
              foreignField: "_id",
              as: "major",
            },
          },
          { $unwind: "$major" },
        ],
      },
    },
    {
      $unwind: "$job_request",
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);
  let pagination = await RecommendedExperts.aggregatePaginate(aggregate, {
    sort: { _id: 1 },
    page,
    limit,
    lean: true,
    customLabels: {
      docs: "job_requests",
    },
  });
  pagination = {
    ...pagination,
    job_requests: pagination.job_requests.map(
      (job_request) => job_request.job_request
    ),
  };
  return pagination;
};

const fetchTopExperts = async (num = 5) => {
  const experts = ExpertInfo.find()
    .sort({
      average_rating: -1,
      rating_count: -1,
    })
    .populate("user", "first_name last_name gender photo_url")
    .limit(num)
    .lean();
  return experts;
};

export default {
  fetchExpertsPagination,
  fetchExpertById,
  fetchCertificatesByExpertId,
  fetchExpertByUserId,
  fetchUnverifiedCertificatesByExpertId,
  fetchVerifiedMajorsByExpertId,
  fetchVerifiedMajorsByUserId,
  fetchExpertsHavingUnverifiedCert,
  fetchRecommendedJobRequestsByExpertId,
  fetchTopExperts,
};
