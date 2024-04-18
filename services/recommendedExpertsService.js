import httpStatus from "http-status";
import {
  RecommendedExperts,
  JobRequest,
  ExpertInfo,
  Certificate,
  User,
} from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import moment from "moment";
import WeightedList from "js-weighted-list";
import dotenv from "dotenv";

dotenv.config();

const createRecommendedExperts = async (job_request_id) => {
  const job_request = await JobRequest.findById(job_request_id);
  if (!job_request) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Job request not found");
  }

  const RECOMMENDED_EXPERT_MIN = parseInt(process.env.RECOMMENDED_EXPERT_MIN);
  const RECOMMENDED_EXPERT_PERCENT = parseFloat(
    process.env.RECOMMENDED_EXPERT_PERCENT
  );

  const random_expertIds = await getRandomExpertIds({
    major_id: job_request.major,
    city_code: job_request.address.city.code,
    percent: RECOMMENDED_EXPERT_PERCENT,
    min_experts: RECOMMENDED_EXPERT_MIN,
  });

  await RecommendedExperts.findOneAndUpdate(
    {
      job_request: job_request_id,
    },
    {
      experts: random_expertIds.map((id) => new mongoose.Types.ObjectId(id)),
    },
    { upsert: true }
  );
};

const getRandomExpertIds = async ({
  major_id,
  city_code = 0,
  percent = 100,
  min_experts = null,
}) => {
  const pipeline = [
    {
      $unwind: "$verified_majors",
    },
    {
      $match: {
        verified_majors: new mongoose.Types.ObjectId(major_id),
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        descriptions: { $first: "$descriptions" },
        average_rating: { $first: "$average_rating" },
        createdAt: { $first: "$createdAt" },
      },
    },
  ];

  if (city_code) {
    pipeline.push(
      {
        $lookup: {
          from: User.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                address: 1,
              },
            },
            {
              $match: {
                "address.city.code": city_code,
              },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      }
    );
  }

  const experts = await ExpertInfo.aggregate(pipeline).exec();

  if (min_experts && experts.length <= min_experts)
    return experts.map((i) => i._id);

  return getWeightedRandomExpertIds(experts, percent, min_experts);
};

const getWeightedRandomExpertIds = (experts, percent, min_experts = null) => {
  const normalizedExperts = normalize(experts);
  const weightedExperts = new WeightedList(
    normalizedExperts.map((expert) => {
      return [
        expert._id,
        calculateExpertWeight(
          expert.normalized_rating,
          expert.normalized_days_diff
        ),
        {
          ...expert,
        },
      ];
    })
  );

  let quantity = Math.round((experts.length * percent) / 100);
  if (min_experts) quantity = quantity <= min_experts ? min_experts : quantity;

  const expertIds = weightedExperts.peek(quantity).map((i) => i.key);

  return expertIds;
};

const normalize = (experts) => {
  const max_rating = 5;
  experts = experts.map((expert) => {
    return {
      ...expert,
      normalized_rating: minMaxNormalize(expert.average_rating, 0, max_rating),
      days_diff_from_today: calculateDaysDiffenrenceVsToday(expert.createdAt),
    };
  });

  const days_diffs = experts.map((expert) => expert.days_diff_from_today);
  const max_days_diff = Math.max(...days_diffs);
  const min_days_diff = Math.min(...days_diffs);

  experts = experts.map((expert) => {
    return {
      ...expert,
      normalized_days_diff: reversedMinMaxNormalize(
        expert.days_diff_from_today,
        min_days_diff,
        max_days_diff
      ),
    };
  });

  return experts;
};

const calculateDaysDiffenrenceVsToday = (date) => {
  const today = moment();
  const diff = today.diff(moment(date), "days");
  const DAYS_DIFFERENCE_CAP = parseInt(process.env.DAYS_DIFFERENCE_CAP);

  return diff > DAYS_DIFFERENCE_CAP ? DAYS_DIFFERENCE_CAP : diff;
};

const reversedMinMaxNormalize = (x, min, max) => {
  if (max === min) return 0;
  return (max - x) / (max - min);
};

const minMaxNormalize = (x, min, max) => {
  if (max === min) return 0;
  return (x - min) / (max - min);
};

const calculateExpertWeight = (rating, days_diff) => {
  return 0.7 * rating + 0.3 * days_diff;
};

export default {
  createRecommendedExperts,
  getRandomExpertIds,
  normalize,
  getWeightedRandomExpertIds,
};
