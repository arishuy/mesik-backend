import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const albumSchema = new mongoose.Schema(
  {
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" }, // Reference Artist model
    title: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }], // Array of Song IDs
    photo_url: String,
    photo_public_id: String,
    total_listenings: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

albumSchema.plugin(mongoosePaginate);
const Album = mongoose.model("Album", albumSchema);
export default Album;
