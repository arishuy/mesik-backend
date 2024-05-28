import { Playlist, SuggestedPlaylist } from "../models/index.js";

const getSuggestedPlaylists = async (user_id) => {
  const suggestedPlaylists = await SuggestedPlaylist.find({
    user: user_id,
    status: 0,
  })
    .populate({
      path: "playlist",
      select: "title songs",
      populate: {
        path: "songs",
        select: "title artist photo_url duration file isPremium lyric",
        populate: {
          path: "artist",
          select: "user display_name",
          populate: {
            path: "user",
            select: "first_name last_name photo_url",
          },
        },
      },
    })
    .sort({ createdAt: -1 })
    .limit(4);
  return suggestedPlaylists;
};

const addToMyPlaylist = async (user_id, suggested_playlist_id) => {
  const suggestedPlaylist = await SuggestedPlaylist.findOne({
    playlist: suggested_playlist_id,
    user: user_id,
  });

  if (!suggestedPlaylist) {
    throw new Error("Playlist not found");
  }

  suggestedPlaylist.status = 1;
  await suggestedPlaylist.save();

  const playlist = await Playlist.findById(suggestedPlaylist.playlist);
  playlist.user = user_id;
  await playlist.save();

  return playlist;
};

export default {
  getSuggestedPlaylists,
  addToMyPlaylist,
};
