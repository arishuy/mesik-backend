import handlerFactory from "./handlerFactory.js";
import Album from "../models/Album.js";

const createAlbum = handlerFactory.createOne(Album);
const getAllAlbums = handlerFactory.getAll(Album);
const getAlbumById = handlerFactory.getOne(Album);
const updateAlbum = handlerFactory.updateOne(Album);
const deleteAlbum = handlerFactory.deleteOne(Album);

export default {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
};
