import handlerFactory from "./handlerFactory.js";
import Playlist from "../models/Playlist.js";

const createPlaylist = handlerFactory.createOne(Playlist);
const getAllPlaylists = handlerFactory.getAll(Playlist);
const getPlaylistById = handlerFactory.getOne(Playlist);
const updatePlaylist = handlerFactory.updateOne(Playlist);
const deletePlaylist = handlerFactory.deleteOne(Playlist);

export default {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
};
