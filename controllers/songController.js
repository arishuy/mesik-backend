import songService from "../services/songService.js";

const createSong = async (req, res, next) => {
  try {
    const { title, year, duration, genre_id, artist_id, play_count } = req.body;
    const photo = req.files.photo[0];
    const file = req.files.file[0].buffer;
    const song = await songService.createSong({
      title,
      year,
      duration,
      genre_id,
      artist_id,
      file,
      photo,
      play_count,
    });
    res.json({ song });
  } catch (error) {
    next(error);
  }
};

const getSongById = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    const song = await songService.fetchSongById(song_id);

    res.json({ song });
  } catch (error) {
    next(error);
  }
};

const getSongs = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await songService.fetchSongs(page, limit);

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deleteSong = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    await songService.deleteSongById(song_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const fetch5SongsRelease = async (req, res, next) => {
  try {
    const result = await songService.fetch5SongsRelease();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export default {
  createSong,
  getSongs,
  getSongById,
  deleteSong,
  fetch5SongsRelease,
};
