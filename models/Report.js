import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const reportSchema = new mongoose.Schema(
  {
    title: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
    },
    description: String,
    photo_url: String,
    photo_public_id: String,
  },
  {
    collection: "report",
    timestamps: true,
  }
);

reportSchema.plugin(mongoosePaginate);

const Report = mongoose.model("Report", reportSchema);

export default Report;
