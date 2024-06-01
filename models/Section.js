import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const sectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.ObjectId, ref: "Album" }],
    type: {
      type: String,
      required: true,
      enum: ["section", "banner"],
      default: "section",
    },
  },
  {
    collection: "section",
    timestamps: true,
  }
);

sectionSchema.plugin(mongoosePaginate);
const Section = mongoose.model("Section", sectionSchema);

export default Section;
