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
    if (req.authData.user.role !== "ADMIN") {
      const user_id = req.authData.user._id;
      await albumService.deleteAlbumByArtist(album_id, user_id);
    } else await albumService.deleteAlbumById(album_id);

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
const incresasePlayCount = async (req, res, next) => {
  try {
    const user_id = req.authData.user._id;
    const { id } = req.body;
    const result = await albumService.incresasePlayCount(user_id, id);
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const getFamousAlbums = async (req, res, next) => {
  try {
    const albums = await albumService.getFamousAlbums();
    res.json({ albums });
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
  incresasePlayCount,
  getFamousAlbums,
};
