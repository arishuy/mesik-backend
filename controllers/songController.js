import songService from "../services/songService.js";

const createSong = async (req, res, next) => {
  try {
    const {
      title,
      release_date,
      duration,
      genre_id,
      region_id,
      artist_id,
      featuredArtists,
      play_count,
    } = req.body;
    const photo = req.files.photo[0];
    const file = req.files.file[0].buffer;
    const song = await songService.createSong({
      title,
      release_date,
      duration,
      genre_id,
      region_id,
      artist_id,
      featuredArtists,
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
    const {
      title,
      featuredArtists,
      release_date,
      duration,
      genre_id,
      region_id,
      play_count,
    } = req.body;
    const photo = req.files.photo[0];
    const file = req.files.file[0].buffer;
    const song = await songService.createSongByArtist({
      title,
      featuredArtists,
      release_date,
      duration,
      genre_id,
      region_id,
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
    const { page, limit, name, genre } = req.query;
    if (page && limit) {
      const pagination = await songService.fetchSongs(page, limit, name, genre);
      return res.json({ pagination });
    } else {
      const songs = await songService.fetchAllSongs();
      return res.json({ songs });
    }
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
    const { page, limit } = req.query;
    if (page && limit) {
      const pagination = await songService.fetchSongByArtistPaginate(
        artist_id,
        page,
        limit
      );
      return res.json({ pagination });
    } else {
      const result = await songService.fetchSongByArtist(artist_id);
      res.json({ result });
    }
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
    const {
      title,
      release_date,
      duration,
      genre,
      region,
      artist,
      isPremium,
      featuredArtists,
    } = req.body;
    const song = await songService.updateSong({
      song_id,
      title,
      release_date,
      duration,
      genre,
      region,
      artist,
      isPremium,
      featuredArtists,
    });
    res.json({ song });
  } catch (error) {
    next(error);
  }
};

const updateSongByArtist = async (req, res, next) => {
  try {
    const { song_id } = req.params;
    const user_id = req.authData.user._id;
    const {
      title,
      release_date,
      duration,
      genre,
      region,
      artist,
      isPremium,
      featuredArtists,
    } = req.body;
    const result = await songService.updateSongByArtist({
      user_id,
      song_id,
      title,
      release_date,
      duration,
      genre,
      region,
      artist,
      isPremium,
      featuredArtists,
    });
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const addLyricToSongByArtist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { song_id } = req.params;
    const { lyric } = req.body;
    await songService.addLyricToSongByArtist(user_id, song_id, lyric);
    res.json({ message: "Added lyric to song successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteSongByArtist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { song_id } = req.params;
    await songService.deleteSongByArtist(user_id, song_id);
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const addSongToPlaying = async (req, res, next) => {
  try {
    const { song_id } = req.body;
    const result = await songService.addSongToPlaying(song_id);
    res.json({ result });
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
  updateSongByArtist,
  addLyricToSongByArtist,
  deleteSongByArtist,
  addSongToPlaying,
};
