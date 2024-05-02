import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const artistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      index: true,
      unique: true,
    },
    descriptions: String,
    albums: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Album",
          index: true,
        },
      ],
      default: [],
    },
    songs: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Song",
          index: true,
        },
      ],
      default: [],
    },
    display_name: {
      type: String,
      required: true,
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          index: true,
        },
      ],
      default: [],
    },
  },
  {
    collection: "artists",
    timestamps: true,
  }
);

artistSchema.plugin(mongoosePaginate);
artistSchema.plugin(aggregatePaginate);

const Artist = mongoose.model("Artist", artistSchema);

export default Artist;
