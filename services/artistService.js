import { Artist, Song, Album, Listening } from "../models/index.js";

const createArtist = async ({ name, description }) => {
  const artist = await Artist.create({
    name: name,
    description: description,
  });

  return artist;
};

const fetchArtistById = async (artist_id) => {
  const artist = await Artist.findById(artist_id).populate({
    path: "user",
    select: "first_name last_name photo_url",
  });
  artist.albums = await Album.find({ artist: artist_id })
    .populate({
      path: "songs",
      select: "title photo_url file duration artist isPremium",
      populate: {
        path: "artist",
        select: "user",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      },
    })
    .limit(6);
  const songs = await Song.find({ artist: artist_id }).populate({
    path: "artist",
    select: "user",
    populate: {
      path: "user",
      select: "first_name last_name photo_url",
    },
  });
  for (const song of songs)
    song.play_count = await Listening.countDocuments({ song: song._id });

  artist.songs = songs.sort((a, b) => b.play_count - a.play_count).slice(0, 6);

  return artist;
};

const fetch5Artists = async () => {
  const artists = await Artist.find()
    .limit(6)
    .sort({ total_followers: -1 })
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
