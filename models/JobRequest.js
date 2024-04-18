import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { job_request_status } from "../config/constant.js";
import { number } from "yup";

const jobRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", index: true },
    expert: { type: mongoose.Schema.ObjectId, ref: "ExpertInfo", index: true },
    major: { type: mongoose.Schema.ObjectId, ref: "Major", index: true },
    title: String,
    descriptions: String,
    address: {
      type: {
        city: {
          name: String,
          code: Number,
        },
        district: {
          name: String,
          code: Number,
        },
        ward: {
          name: String,
          code: Number,
        },
        other_detail: String,
      },
      default: {
        city: {
          name: "",
          code: 0,
        },
        district: {
          name: "",
          code: 0,
        },
        ward: {
          name: "",
          code: 0,
        },
        other_detail: "",
      },
    },
    price: { type: Number, min: 0, default: 0 },
    status: {
      type: String,
      enum: Object.values(job_request_status),
      default: job_request_status.PENDING,
    },
    time_booking: Date,
    time_payment: Date,
    is_reviewed: { type: Boolean, default: false },
  },
  {
    collection: "job_request",
    timestamps: true,
  }
);

jobRequestSchema.plugin(mongoosePaginate);

const JobRequest = mongoose.model("JobRequest", jobRequestSchema);

export default JobRequest;
