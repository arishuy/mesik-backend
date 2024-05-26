import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    items: [{ type: mongoose.Schema.ObjectId, ref: "Playlist" }],
  },
  {
    collection: "section",
    timestamps: true,
  }
);

const Section = mongoose.model("Section", sectionSchema);

export default Section;
