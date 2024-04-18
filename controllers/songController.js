import songService from "../services/songService.js";

const createSong = async (req, res, next) => {
  try {
    const { title, year, duration, file, thumbnail, play_count } = req.body;
    const song = await songService.createSong({
      title,
      year,
      duration,
      file,
      thumbnail,
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

export default {
  createSong,
  getSongs,
  getSongById,
  deleteSong,
};
