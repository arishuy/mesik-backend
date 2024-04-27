import artistService from "../services/artistService.js";

const createArtist = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const artist = await artistService.createArtist({
      name,
      description,
    });
    res.json({ artist });
  } catch (error) {
    next(error);
  }
};

const getArtistById = async (req, res, next) => {
  try {
    const { artist_id } = req.params;
    const artist = await artistService.fetchArtistById(artist_id);
    res.json({ artist });
  } catch (error) {
    next(error);
  }
};

const get5Artists = async (req, res, next) => {
  try {
    const artists = await artistService.fetch5Artists();
    res.json({ artists });
  } catch (error) {
    next(error);
  }
};
const getArtists = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await artistService.fetchArtists(page, limit);

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deleteArtist = async (req, res, next) => {
  try {
    const { artist_id } = req.params;
    await artistService.deleteArtistById(artist_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

export default {
  createArtist,
  getArtists,
  getArtistById,
  deleteArtist,
  get5Artists,
};
