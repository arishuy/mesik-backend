import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import MongooseDelete from "mongoose-delete";

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
regionSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Region = mongoose.model("Region", regionSchema);

export default Region;
