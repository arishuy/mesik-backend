import { Album, Artist } from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";

const createAlbum = async ({ title, song_id, artist_id, photo }) => {
  let response;
  if (photo) {
    response = await cloudinaryService.upload(photo);
  }
  const album = await Album.create({
    title: title,
    songs: song_id,
    artist: artist_id,
    photo_url: response ? response.url : null,
    photo_public_id: response ? response.public_id : null,
  });
  return album;
};

const fetchAlbumById = async (album_id) => {
  const album = await Album.findById(album_id).populate({
    path: "songs",
    select: "title photo_url file duration artist createdAt isPremium",
    populate: {
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    },
  });
  return album;
};
const fetchAlbumByArtist = async (artist_id) => {
  const album = await Album.find({ artist: artist_id }).populate({
    path: "songs",
    select: "title photo_url file duration artist isPremium createdAt",
    populate: {
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    },
  });
  return album;
};
const fetchAlbums = async (page = 1, limit = 10) => {
  const pagination = await Album.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      lean: true,
      customLabels: {
        docs: "albums",
      },
      populate: {
        path: "artist",
        select: "user display_name",
      },
    }
  );
  return pagination;
};

const deleteAlbumById = async (album_id) => {
  await Album.deleteOne({ _id: album_id });
};

const deleteAlbumByArtist = async (album_id, user_id) => {
  const artist_id = await Artist.findOne({ user: user_id });
  if (!artist_id) {
    throw new Error("Artist not found");
  }
  const album = await Album.findOne({ _id: album_id, artist: artist_id });
  if (!album) {
    throw new Error("Album not found");
  }
  await Album.deleteOne({ _id: album_id });
};
export default {
  createAlbum,
  fetchAlbums,
  fetchAlbumById,
  fetchAlbumByArtist,
  deleteAlbumById,
  deleteAlbumByArtist,
};
