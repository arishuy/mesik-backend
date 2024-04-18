import {
  JobRequest,
  Notification,
  RecommendedExperts,
  Transaction,
} from "../models/index.js";
import { notification_types } from "../config/constant.js";
import pusherService from "../services/pusherService.js";

const fetchNotificationsByUserId = async (user_id, limit = 10) => {
  const notifications = await Notification.find({ user: user_id })
    .sort({ createdAt: -1 })
    .limit(limit);
  return notifications;
};

const updateSeenNotification = async (notification_id, user_id) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notification_id, user: user_id },
    { is_seen: true },
    { new: true }
  );
  return notification;
};

const notifyNewJobRequest = async (job_request_id) => {
  const recommendedExperts = await RecommendedExperts.findOne({
    job_request: job_request_id,
  })
    .populate([
      {
        path: "job_request",
        select: "user title descriptions price",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
      {
        path: "experts",
        select: "user",
      },
    ])
    .lean();
  const job_request = recommendedExperts.job_request;
  const experts = recommendedExperts.experts;

  const new_notifications = experts.map((expert) => {
    return {
      user: expert.user,
      type: notification_types.NEW_JOB_REQUEST,
      ref: {
        job_request,
      },
    };
  });

  const notifications = await Notification.insertMany(new_notifications);

  pusherService.notifyMultipleUsers(notifications);

  return notifications;
};

const notifyJobRequestAccepted = async (job_request_id) => {
  const job_request = await JobRequest.findById(job_request_id)
    .select("user expert title descriptions price")
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
    ]).lean();

  const notification = await Notification.create({
    user: job_request.user._id,
    type: notification_types.JOB_REQUEST_ACCEPTED,
    ref: {
      job_request,
    },
  });

  pusherService.notify(notification);

  return notification;
};

const notifyJobRequestCanceled = async (job_request_id) => {
  const job_request = await JobRequest.findById(job_request_id)
    .select("user expert title descriptions price")
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
    ]).lean();

  const notification = await Notification.create({
    user: job_request.user._id,
    type: notification_types.JOB_REQUEST_CANCELED,
    ref: {
      job_request,
    },
  });

  pusherService.notify(notification);

  return notification;
};

const notifyPayment = async (transaction_id) => {
  const transaction = await Transaction.findById(transaction_id)
    .select("user expert job_request amount")
    .populate([
      {
        path: "user",
        select: "first_name last_name photo_url",
      },
      {
        path: "expert",
        select: "first_name last_name photo_url",
      },
      {
        path: "job_request",
        select: "title",
      },
    ]).lean();

  const notification = await Notification.create({
    user: transaction.expert._id,
    type: notification_types.PAYMENT,
    ref: {
      transaction,
    },
  });

  pusherService.notify(notification);

  return notification;
};

export default {
  fetchNotificationsByUserId,
  updateSeenNotification,
  notifyNewJobRequest,
  notifyJobRequestAccepted,
  notifyJobRequestCanceled,
  notifyPayment,
};
