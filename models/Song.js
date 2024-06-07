import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    album: { type: String },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" }, // Reference Artist model
    featuredArtists: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }],
      default: [],
    }, // Reference Artist model for featured artists
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" }, // Reference Genre model
    duration: { type: Number },
    file: { type: String }, // Path to the file on the server
    photo_url: { type: String },
    photo_public_id: { type: String },
    play_count: { type: Number, default: 0 },
    play_count_daily: { type: Number, default: 0 },
    lyric: { type: String },
    release_date: { type: Date },
    isPremium: { type: Boolean, default: false },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

songSchema.plugin(mongoosePaginate);
const Song = mongoose.model("Song", songSchema);
export default Song;
