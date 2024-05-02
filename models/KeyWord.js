import mongoose from "mongoose";

const KeyWordSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const KeyWord = mongoose.model("KeyWord", KeyWordSchema);
export default KeyWord;
