import { Album } from "../models/index.js";
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
    select: "title photo_url file duration artist createdAt",
    populate: {
      path: "artist",
      select: "user",
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
    select: "title photo_url file duration artist",
    populate: {
      path: "artist",
      select: "user",
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
    }
  );
  return pagination;
};

const deleteAlbumById = async (album_id) => {
  await Album.deleteOne({ _id: album_id });
};

export default {
  createAlbum,
  fetchAlbums,
  fetchAlbumById,
  fetchAlbumByArtist,
  deleteAlbumById,
};
