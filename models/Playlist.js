import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const playlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference User model
    title: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Array of Song IDs
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

playlistSchema.plugin(mongoosePaginate);
const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
