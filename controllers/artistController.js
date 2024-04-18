import handlerFactory from "./handlerFactory.js";
import Artist from "../models/Artist.js";

const createArtist = handlerFactory.createOne(Artist);
const getAllArtists = handlerFactory.getAll(Artist);
const getArtistById = handlerFactory.getOne(Artist);
const updateArtist = handlerFactory.updateOne(Artist);
const deleteArtist = handlerFactory.deleteOne(Artist);

export default {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
