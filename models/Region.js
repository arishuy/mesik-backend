import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const regionSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

regionSchema.plugin(mongoosePaginate);

const Region = mongoose.model("Region", regionSchema);

export default Region;
