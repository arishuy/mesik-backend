import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", index: true },
    expert: { type: mongoose.Schema.ObjectId, ref: "ExpertInfo", index: true },
    job_request: {
      type: mongoose.Schema.ObjectId,
      ref: "JobRequest",
      index: true,
    },
    rating: { type: Number, min: 0, max: 5 },
    comment: String,
    status: Number,
  },
  {
    collection: "review",
    timestamps: true,
  }
);

reviewSchema.plugin(mongoosePaginate);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
