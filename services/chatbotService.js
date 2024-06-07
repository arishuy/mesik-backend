import Axios from "axios";
import {
  createThread,
  askChatbot,
  runAssistant,
  deleteThread,
} from "../utils/chatbot.js";
import dotenv from "dotenv";
import Song from "../models/Song.js";
dotenv.config();
const createUserThread = async () => {
  const thread = await createThread();
  return thread;
};

const deleteUserThread = async (threadId) => {
  const thread = await deleteThread(threadId);
  return thread;
};
const findSong = async (lyric) => {
  const response = await Axios.get(
    process.env.RECOMMEND_ENDPOINT + `/search?query=${lyric}`
  );
  let song;
  if (response.data.song_id) {
    song = await Song.findById(response.data.song_id).populate[
      ({
        path: "artist",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
      {
        path: "featuredArtists",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      })
    ];
    return song;
  }
};
export default { createUserThread, deleteUserThread, findSong };
