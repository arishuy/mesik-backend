import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const majorSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, index: true },
    descriptions: String,
  },
  { collection: "majors" }
);

majorSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Major = mongoose.model("Major", majorSchema);

export default Major;
