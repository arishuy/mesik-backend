import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    about: { type: String, required: true },
    gerne: { type: mongoose.Schema.Types.ObjectId, ref: "Genre" },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

artistSchema.plugin(mongoosePaginate);
const Artist = mongoose.model("Artist", artistSchema);
export default Artist;
