import { Song } from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";
import { uploadAudio } from "../utils/aws.js";

const createSong = async ({
  title,
  year,
  duration,
  genre_id,
  artist_id,
  file = "",
  photo,
  play_count = 0,
}) => {
  let response;
  let link;
  if (file) {
    link = await uploadAudio(title, file);
  }
  if (photo) {
    response = await cloudinaryService.upload(photo);
  }
  const song = await Song.create({
    title: title,
    year: year,
    duration: duration,
    file: link,
    genre: genre_id,
    artist: artist_id,
    photo_url: response ? response.url : null,
    photo_public_id: response ? response.public_id : null,
    play_count: play_count,
  });

  return song;
};

const fetchSongById = async (song_id) => {
  const song = await Song.findById(song_id);
  return song;
};

const fetchSongs = async (page = 1, limit = 10) => {
  const pagination = await Song.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      populate: [
        {
          path: "artist",
          select: "user",
          populate: {
            path: "user",
            select: "first_name last_name photo_url",
          },
        },
      ],
      lean: true,
      customLabels: {
        docs: "songs",
      },
    }
  );
  return pagination;
};

const deleteSongById = async (song_id) => {
  await Song.deleteOne({ _id: song_id });
};

const fetch5SongsRelease = async () => {
  const songs = await Song.find({})
    .sort({ createdAt: -1 })
    .limit(4)
    .lean()
    .populate({
      path: "artist",
      select: "user",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });
  return songs;
};

export default {
  createSong,
  fetchSongs,
  fetchSongById,
  deleteSongById,
  fetch5SongsRelease,
};
