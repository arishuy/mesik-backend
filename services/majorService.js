import { Song } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const createSong = async ({ name, descriptions }) => {
  if (await Song.exists({ name: name })) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Song's name already exists");
  }
  const Song = await Song.create({ name, descriptions });
  return Song;
};

const fetchAllSongs = async () => {
  const Songs = await Song.find();
  return Songs;
};

const fetchSongById = async (Song_id) => {
  const Song = await Song.findById(Song_id);
  if (!Song) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Song not found");
  }
  return Song;
};

const updateSong = async ({ Song_id, name, descriptions }) => {
  const Song = await Song.findById(Song_id);
  if (!Song) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Song not found");
  }
  Song.name = name || Song.name;
  Song.descriptions = descriptions || Song.descriptions;
  await Song.save();
  return Song;
};

const deleteSongById = async (Song_id) => {
  await Song.deleteById(Song_id);
};

export default {
  createSong,
  fetchAllSongs,
  fetchSongById,
  updateSong,
  deleteSongById,
};
