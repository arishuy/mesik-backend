import { Playlist } from "../models/index.js";

const createPlaylist = async ({ title, user_id }) => {
  const playlist = await Playlist.create({
    title: title,
    user: user_id,
    songs: [],
  });

  return playlist;
};

const createPlaylistWithSongs = async ({ title, user_id, song_id }) => {
  const playlist = await Playlist.create({
    title: title,
    user: user_id,
    songs: song_id,
  });

  return playlist;
};

const fetchPlaylistById = async (playlist_id) => {
  const playlist = await Playlist.findById(playlist_id).populate({
    path: "songs",
    select: "title artist photo_url duration file isPremium",
    populate: {
      path: "artist",
      select: "user display_name",
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
    {
      user: { $ne: null },
    },
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "playlists",
      },
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    }
  );

  return pagination;
};

const deletePlaylistById = async (playlist_id) => {
  await Playlist.deleteOne({ _id: playlist_id });
};

const deletePlaylistByUser = async (playlist_id, user_id) => {
  const playlist = await Playlist.findById(playlist_id);
  if (playlist.user.toString() !== user_id.toString()) {
    throw new Error("Unauthorized");
  }
  await Playlist.deleteOne({ _id: playlist_id });
};

const fetchPlaylistByUser = async (user_id) => {
  const playlists = await Playlist.find({ user: user_id }).populate({
    path: "songs",
    select: "title artist photo_url duration file isPremium",
    populate: {
      path: "artist",
      select: "user display_name",
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
  // check if song already exists in playlist
  for (let song of playlist.songs) {
    if (song.toString() === song_id.toString()) {
      throw new Error("Song already exists in playlist");
    }
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

const updatePlaylist = async (playlist_id, title, user_id) => {
  const playlist = await Playlist.findById(playlist_id);
  if (playlist.user.toString() !== user_id.toString()) {
    throw new Error("Unauthorized");
  }
  playlist.title = title;
  await playlist.save();
};

export default {
  createPlaylist,
  fetchPlaylists,
  fetchPlaylistById,
  deletePlaylistById,
  deletePlaylistByUser,
  fetchPlaylistByUser,
  addSongToPlaylist,
  removeSongFromPlaylist,
  updatePlaylist,
  createPlaylistWithSongs,
};
