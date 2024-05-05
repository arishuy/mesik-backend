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

const createSongByArtist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { title, year, duration, genre_id, play_count } = req.body;
    const photo = req.files.photo[0];
    const file = req.files.file[0].buffer;
    const song = await songService.createSongByArtist({
      title,
      year,
      duration,
      genre_id,
      user_id,
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
    const result = await songService.fetch6SongsRelease();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const fetchRandomSongs = async (req, res, next) => {
  try {
    const result = await songService.fetchRandomSongs();
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const fetchSongByArtist = async (req, res, next) => {
  try {
    const { artist_id } = req.params;
    const result = await songService.fetchSongByArtist(artist_id);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const incresasePlayCount = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { id } = req.body;
    const result = await songService.incresasePlayCount(user_id, id);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const addLyricToSong = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    const { lyric } = req.body;
    await songService.addLyricToSong(song_id, lyric);
    res.json({ message: "Added lyric to song successfully" });
  } catch (error) {
    next(error);
  }
};

const getLyricsFromSong = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    const result = await songService.getLyricsFromSong(song_id);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const updateSong = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    const { title, year, duration, genre, artist } = req.body;
    const song = await songService.updateSong({
      song_id,
      title,
      year,
      duration,
      genre,
      artist,
    });
    res.json({ song });
  } catch (error) {
    next(error);
  }
};

export default {
  createSong,
  createSongByArtist,
  getSongs,
  getSongById,
  deleteSong,
  fetch5SongsRelease,
  fetchRandomSongs,
  fetchSongByArtist,
  incresasePlayCount,
  addLyricToSong,
  getLyricsFromSong,
  updateSong,
};
