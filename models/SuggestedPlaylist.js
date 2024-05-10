import mongoose from "mongoose";

const suggestedPlaylistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", index: true },
    playlist: { type: mongoose.Schema.ObjectId, ref: "Playlist", index: true },
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "suggested_playlist",
    timestamps: true,
  }
);

const SuggestedPlaylist = mongoose.model(
  "SuggestedPlaylist",
  suggestedPlaylistSchema
);

export default SuggestedPlaylist;
