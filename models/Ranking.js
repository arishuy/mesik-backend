import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song", // Thay 'Song' bằng tên của model của bài hát
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Ranking = mongoose.model("Ranking", rankingSchema);

export default Ranking;
