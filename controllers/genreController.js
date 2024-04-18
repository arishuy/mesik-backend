import handlerFactory from "./handlerFactory.js";
import Genre from "../models/Genre.js";

const createGenre = handlerFactory.createOne(Genre);
const getAllGenres = handlerFactory.getAll(Genre);
const getGenreById = handlerFactory.getOne(Genre);
const updateGenre = handlerFactory.updateOne(Genre);
const deleteGenre = handlerFactory.deleteOne(Genre);

export default {
  createGenre,
  getAllGenres,
  getGenreById,
  updateGenre,
  deleteGenre,
};
