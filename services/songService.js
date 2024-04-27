import { Song, User } from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";
import { uploadAudio } from "../utils/aws.js";

const createSong = async ({
  title,
  year,
  duration,
  genre_id,
  artist_id,
  file = "",
  photo,
  play_count = 0,
}) => {
  let response;
  let link;
  if (file) {
    link = await uploadAudio(title, file);
  }
  if (photo) {
    response = await cloudinaryService.upload(photo);
  }
  const song = await Song.create({
    title: title,
    year: year,
    duration: duration,
    file: link,
    genre: genre_id,
    artist: artist_id,
    photo_url: response ? response.url : null,
    photo_public_id: response ? response.public_id : null,
    play_count: play_count,
  });

  return song;
};

const fetchSongById = async (song_id) => {
  const song = await Song.findById(song_id);
  return song;
};

const fetchSongs = async (page = 1, limit = 10) => {
  const pagination = await Song.paginate(
    {},
    {
      sort: { createdAt: -1 },
      page,
      limit,
      populate: [
        {
          path: "artist",
          select: "user",
          populate: {
            path: "user",
            select: "first_name last_name photo_url",
          },
        },
      ],
      lean: true,
      customLabels: {
        docs: "songs",
      },
    }
  );
  return pagination;
};

const deleteSongById = async (song_id) => {
  await Song.deleteOne({ _id: song_id });
};

const fetch6SongsRelease = async () => {
  const songs = await Song.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .lean()
    .populate({
      path: "artist",
      select: "user",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });
  return songs;
};

const fetchRandomSongs = async () => {
  const songs = await Song.aggregate([
    { $sample: { size: 6 } }, // Lấy ngẫu nhiên 6 bản ghi
    {
      $lookup: {
        from: "artists", // Tên của collection chứa thông tin về nghệ sĩ
        localField: "artist", // Trường trong collection hiện tại để join
        foreignField: "_id", // Trường trong collection artist để join
        as: "artist", // Tên biến mới sau khi join
      },
    },
    { $unwind: "$artist" }, // Giải nén mảng sau khi join
    {
      $lookup: {
        from: "users", // Tên của collection chứa thông tin về users
        localField: "artist.user", // Trường trong artist để join
        foreignField: "_id", // Trường trong collection user để join
        as: "artist.user", // Tên biến mới sau khi join
      },
    },
    { $unwind: "$artist.user" }, // Giải nén mảng sau khi join
    {
      $project: {
        title: 1, // Chỉ giữ lại trường title
        photo_url: 1, // Chỉ giữ lại trường photo_url
        play_count: 1, // Chỉ giữ lại trường play_count
        file: 1, // Chỉ giữ lại trường file
        duration: 1, // Chỉ giữ lại trường duration
        artist: {
          user: {
            first_name: 1,
            last_name: 1,
            photo_url: 1,
          },
        },
      },
    },
  ]);

  return songs;
};

const fetchSongByArtist = async (artist_id) => {
  const songs = await Song.find({ artist: artist_id })
    .lean()
    .populate({
      path: "artist",
      select: "user",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });
  return songs;
};

const incresasePlayCount = async (user_id, song_id) => {
  // Fetch user data
  const user = await User.findById(user_id);

  // Check if the song is already in the history_listen array
  const songIndex = user.history_listen.indexOf(song_id);
  if (songIndex !== -1) {
    // Remove the song from its current position
    user.history_listen.splice(songIndex, 1);
    user.history_listen.push(song_id);
  } else {
    // Remove the oldest song if history_listen is at max length
    if (user.history_listen.length === 6) {
      user.history_listen.shift();
    }
    // If song is not in history, add it
    user.history_listen.push(song_id);
  }

  // Update user's history_listen array
  await User.findByIdAndUpdate(user_id, {
    $set: { history_listen: user.history_listen },
  });

  // Update song's play count
  const song = await Song.findByIdAndUpdate(
    song_id,
    { $inc: { play_count: 1 } },
    { new: true } // Returns the modified document
  );

  return song;
};

export default {
  createSong,
  fetchSongs,
  fetchSongById,
  deleteSongById,
  fetch6SongsRelease,
  fetchRandomSongs,
  fetchSongByArtist,
  incresasePlayCount,
};
