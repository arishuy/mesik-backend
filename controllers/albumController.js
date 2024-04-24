import albumService from "../services/albumService.js";

const createAlbum = async (req, res, next) => {
  try {
    const { title, song_id, artist_id } = req.body;
    const photo = req.file;
    const album = await albumService.createAlbum({
      title,
      song_id,
      artist_id,
      photo,
    });
    res.json({ album });
  } catch (error) {
    next(error);
  }
};

const getAlbumById = async (req, res, next) => {
  try {
    const { album_id } = req.params;
    const album = await albumService.fetchAlbumById(album_id);

    res.json({ album });
  } catch (error) {
    next(error);
  }
};

const getAlbums = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = await albumService.fetchAlbums(page, limit);

    res.json({ pagination });
  } catch (error) {
    next(error);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    const { album_id } = req.params;
    await albumService.deleteAlbumById(album_id);

    res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

const fetchAlbumByArtist = async (req, res, next) => {
  try {
    const { artist_id } = req.params;
    const album = await albumService.fetchAlbumByArtist(artist_id);

    res.json({ album });
  } catch (error) {
    next(error);
  }
};

export default {
  createAlbum,
  getAlbums,
  getAlbumById,
  deleteAlbum,
  fetchAlbumByArtist,
};
