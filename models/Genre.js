import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import MongooseDelete from "mongoose-delete";

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
genreSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Genre = mongoose.model("Genre", genreSchema);
export default Genre;
