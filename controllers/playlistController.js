import playlistService from "../services/playlistService.js";

const createPlaylist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { title } = req.body;
    const playlist = await playlistService.createPlaylist({
      title,
      user_id,
    });
    res.json({ playlist });
  } catch (error) {
    next(error);
  }
};

const getPlaylistById = async (req, res, next) => {
  try {
    const { playlist_id } = req.params;
    const playlist = await playlistService.fetchPlaylistById(playlist_id);

    res.json({ playlist });
  } catch (error) {
    next(error);
  }
};

const getPlaylists = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await playlistService.fetchPlaylists(page, limit);
    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deletePlaylist = async (req, res, next) => {
  try {
    const { playlist_id } = req.params;
    if (req.authData.user.role !== "ADMIN") {
      const user_id = req.authData.user._id;
      await playlistService.deletePlaylistByUser(playlist_id, user_id);
    } else await playlistService.deletePlaylistById(playlist_id);
    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const getPlaylistByUser = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const playlists = await playlistService.fetchPlaylistByUser(user_id);

    res.json({ playlists });
  } catch (error) {
    next(error);
  }
};

const addSongToPlaylist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { playlist_id, song_id } = req.body;
    await playlistService.addSongToPlaylist(playlist_id, song_id, user_id);

    res.json({ message: "Added" });
  } catch (error) {
    next(error);
  }
};

const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { playlist_id, song_id } = req.body;
    await playlistService.removeSongFromPlaylist(playlist_id, song_id, user_id);

    res.json({ message: "Removed" });
  } catch (error) {
    next(error);
  }
};

const updatePlaylist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { playlist_id } = req.params;
    const { title } = req.body;
    const playlist = await playlistService.updatePlaylist(
      playlist_id,
      title,
      user_id
    );

    res.json({ playlist });
  } catch (error) {
    next(error);
  }
};
export default {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  deletePlaylist,
  getPlaylistByUser,
  addSongToPlaylist,
  removeSongFromPlaylist,
  updatePlaylist,
};
