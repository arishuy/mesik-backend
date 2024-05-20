import mongoose from "mongoose";

const TokenizedLyricsSchema = new mongoose.Schema(
  {
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
    lyric: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const TokenizedLyrics = mongoose.model(
  "TokenizedLyrics",
  TokenizedLyricsSchema
);
export default TokenizedLyrics;
