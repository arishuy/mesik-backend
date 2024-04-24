import { populate } from "dotenv";
import { Artist } from "../models/index.js";

const createArtist = async ({ name, description }) => {
  const artist = await Artist.create({
    name: name,
    description: description,
  });

  return artist;
};

const fetchArtistById = async (artist_id) => {
  const artist = await Artist.findById(artist_id);
  return artist;
};

const fetch5Artists = async () => {
  const artists = await Artist.find()
    .limit(5)
    .sort({ createdAt: -1 })
    .populate("user", "first_name last_name photo_url");
  return artists;
};

const fetchArtists = async (page = 1, limit = 10) => {
  const pagination = await Artist.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      populate: [
        {
          path: "user",
          select: "first_name last_name photo_url",
        },
      ],
      lean: true,
      customLabels: {
        docs: "artists",
      },
    }
  );
  return pagination;
};

const deleteArtistById = async (artist_id) => {
  await Artist.deleteOne({ _id: artist_id });
};

export default {
  createArtist,
  fetchArtists,
  fetch5Artists,
  fetchArtistById,
  deleteArtistById,
};
