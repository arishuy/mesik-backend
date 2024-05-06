import genreService from "../services/genreService.js";

const createGenre = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const genre = await genreService.createGenre({
      name,
      description,
    });
    res.json({ genre });
  } catch (error) {
    next(error);
  }
};

const getGenreById = async (req, res, next) => {
  try {
    const { genre_id } = req.params;
    const genre = await genreService.fetchGenreById(genre_id);

    res.json({ genre });
  } catch (error) {
    next(error);
  }
};

const getGenres = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await genreService.fetchGenres(page, limit);

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deleteGenre = async (req, res, next) => {
  try {
    const { genre_id } = req.params;
    await genreService.deleteGenreById(genre_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const updateGenreById = async (req, res, next) => {
  try {
    const { genre_id } = req.params;
    const { name, description } = req.body;
    const genre = await genreService.updateGenreById(genre_id, {
      name,
      description,
    });

    res.json({ genre });
  } catch (error) {
    next(error);
  }
};

export default {
  createGenre,
  getGenres,
  getGenreById,
  deleteGenre,
  updateGenreById,
};
