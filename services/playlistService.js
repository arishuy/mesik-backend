import { Playlist } from "../models/index.js";

const createPlaylist = async ({ title, user_id }) => {
  const playlist = await Playlist.create({
    title: title,
    user: user_id,
    songs: [],
  });

  return playlist;
};

const fetchPlaylistById = async (playlist_id) => {
  const playlist = await Playlist.findById(playlist_id).populate({
    path: "songs",
    select: "title artist photo_url duration file",
    populate: {
      path: "artist",
      select: "user",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    },
  });
  return playlist;
};

const fetchPlaylists = async (page = 1, limit = 10) => {
  const pagination = await Playlist.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "playlists",
      },
    }
  );
  return pagination;
};

const deletePlaylistById = async (playlist_id, user_id) => {
  const playlist = await Playlist.findById(playlist_id);
  if (playlist.user.toString() !== user_id.toString()) {
    throw new Error("Unauthorized");
  }
  await Playlist.deleteOne({ _id: playlist_id });
};

const fetchPlaylistByUser = async (user_id) => {
  const playlists = await Playlist.find({ user: user_id }).populate({
    path: "songs",
    select: "title artist photo_url duration file",
    populate: {
      path: "artist",
      select: "user",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    },
  });
  return playlists;
};

const addSongToPlaylist = async (playlist_id, song_id, user_id) => {
  const playlist = await Playlist.findById(playlist_id);
  if (playlist.user.toString() !== user_id.toString()) {
    throw new Error("Unauthorized");
  }
  playlist.songs.push(song_id);
  await playlist.save();
};

const removeSongFromPlaylist = async (playlist_id, song_id, user_id) => {
  const playlist = await Playlist.findById(playlist_id);
  if (playlist.user.toString() !== user_id.toString()) {
    throw new Error("Unauthorized");
  }
  playlist.songs = playlist.songs.filter(
    (song) => song.toString() !== song_id.toString()
  );
  await playlist.save();
};

export default {
  createPlaylist,
  fetchPlaylists,
  fetchPlaylistById,
  deletePlaylistById,
  fetchPlaylistByUser,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
