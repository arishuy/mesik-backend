import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const genreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

genreSchema.plugin(mongoosePaginate);
const Genre = mongoose.model("Genre", genreSchema);
export default Genre;
