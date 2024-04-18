import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: String,
    expert: {
      type: mongoose.Schema.ObjectId,
      ref: "ExpertInfo",
      index: true,
    },
    description: String,
    file_url: String,
    file_public_id: String,
  },
  {
    collection: "document",
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
