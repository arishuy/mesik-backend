import { Genre } from "../models/index.js";

const createGenre = async ({ name, description }) => {
  const genre = await Genre.create({
    name: name,
    description: description,
  });

  return genre;
};

const fetchGenreById = async (genre_id) => {
  const genre = await Genre.findById(genre_id);
  return genre;
};

const fetchGenres = async (page = 1, limit = 10) => {
  const pagination = await Genre.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "genres",
      },
    }
  );
  return pagination;
};

const deleteGenreById = async (genre_id) => {
  await Genre.deleteOne({ _id: genre_id });
};

const updateGenreById = async (genre_id, { name, description }) => {
  const genre = await Genre.findByIdAndUpdate(
    genre_id,
    { name, description },
    { new: true }
  );
  return genre;
};

export default {
  createGenre,
  fetchGenres,
  fetchGenreById,
  deleteGenreById,
  updateGenreById,
};
