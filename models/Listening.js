import mongoose from "mongoose";

const listeningSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
    required: true,
  },
  listen_at: {
    type: Date,
    default: Date.now,
  },
});

const Listening = mongoose.model("Listening", listeningSchema);
export default Listening;
