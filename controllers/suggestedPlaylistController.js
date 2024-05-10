import suggestedPlaylistService from "../services/suggestedPlaylistService.js";

const getSuggestedPlaylistByUserId = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const suggestedPlaylists =
      await suggestedPlaylistService.getSuggestedPlaylists(user_id);
    res.json({ suggestedPlaylists });
  } catch (error) {
    next(error);
  }
};
const addToMyPlaylist = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { suggested_playlist_id } = req.params;
    const result = await suggestedPlaylistService.addToMyPlaylist(
      user_id,
      suggested_playlist_id
    );
    res.json({ result });
  } catch (error) {
    next(error);
  }
};
export default {
  getSuggestedPlaylistByUserId,
  addToMyPlaylist,
};
