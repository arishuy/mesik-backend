import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const expertInfoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
      unique: true,
    },
    verified_majors: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Major",
        },
      ],
      default: [],
    },
    descriptions: String,
    certificates: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Certificate",
          index: true,
        },
      ],
      default: [],
    },
    average_rating: { type: Number, min: 0, max: 5, default: 0 },
    rating_count: { type: Number, default: 0 },
  },
  {
    collection: "expert_info",
    timestamps: true,
  }
);

expertInfoSchema.plugin(mongoosePaginate);
expertInfoSchema.plugin(aggregatePaginate);

const ExpertInfo = mongoose.model("ExpertInfo", expertInfoSchema);

export default ExpertInfo;
