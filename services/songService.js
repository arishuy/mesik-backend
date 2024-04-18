import { Song } from "../models/index.js";

const createSong = async ({
  title,
  year,
  duration,
  file = "",
  thumbnail = "",
  play_count = 0,
}) => {
  const song = await Song.create({
    title,
    year,
    duration,
    file,
    thumbnail,
    play_count,
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

export default {
  createSong,
  fetchSongs,
  fetchSongById,
  deleteSongById,
};
