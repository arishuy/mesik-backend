import {
  Song,
  User,
  Artist,
  Listening,
  SuggestedPlaylist,
  Playlist,
} from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";
import { uploadAudio } from "../utils/aws.js";
import Axios from "axios";
const createSong = async ({
  title,
  release_date,
  duration,
  genre_id,
  region_id,
  artist_id,
  file = "",
  photo,
  play_count = 0,
}) => {
  let response;
  let link;
  if (file) {
    // name = title + current timestamp
    const name = title + Date.now();
    link = await uploadAudio(name, file);
  }
  if (photo) {
    response = await cloudinaryService.upload(photo);
  }
  const song = await Song.create({
    title: title,
    release_date: release_date,
    duration: duration,
    file: link,
    genre: genre_id,
    region: region_id,
    artist: artist_id,
    photo_url: response ? response.url : null,
    photo_public_id: response ? response.public_id : null,
    play_count: play_count,
  });

  return song;
};

const createSongByArtist = async ({
  title,
  release_date,
  duration,
  genre_id,
  region_id,
  user_id,
  file = "",
  photo,
  play_count = 0,
}) => {
  const artist_id = await Artist.findOne({ user: user_id }).select("_id");
  if (!artist_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not an artist");
  }
  let response;
  let link;
  if (file) {
    const name = title + Date.now();
    link = await uploadAudio(name, file);
  }
  if (photo) {
    response = await cloudinaryService.upload(photo);
  }
  const song = await Song.create({
    title: title,
    release_date: release_date,
    duration: duration,
    file: link,
    genre: genre_id,
    region: region_id,
    artist: artist_id,
    photo_url: response ? response.url : null,
    photo_public_id: response ? response.public_id : null,
    play_count: play_count,
  });

  return song;
};

const fetchSongById = async (song_id) => {
  const song = await Song.findById(song_id).populate({
    path: "artist",
    select: "user display_name",
  });
  const playCount = await Listening.countDocuments({ song: song_id });
  song.play_count = playCount;
  return song;
};

const fetchSongs = async (page = 1, limit = 10, name = "", genre = "all") => {
  const pagination = await Song.paginate(
    {
      title: { $regex: name, $options: "i" },
      genre: genre === "all" ? { $ne: null } : genre,
    },
    {
      sort: { createdAt: -1 },
      page,
      limit,
      populate: [
        {
          path: "artist",
          select: "user display_name",
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
  for (const song of pagination.songs) {
    const playCount = await Listening.countDocuments({ song: song._id });
    song.play_count = playCount;
  }
  return pagination;
};

const deleteSongById = async (song_id) => {
  await Song.deleteOne({ _id: song_id });
};

const fetch6SongsRelease = async () => {
  const songs = await Song.find({})
    .sort({ release_date: -1 })
    .limit(6)
    .lean()
    .populate({
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });

  for (const song of songs)
    song.play_count = await Listening.countDocuments({ song: song._id });

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
        isPremium: 1, // Chỉ giữ lại trường isPremium
        artist: {
          _id: "$artist._id", // Chỉ giữ lại trường _id
          display_name: "$artist.display_name", // Chỉ giữ lại trường display_name
          user: {
            first_name: 1,
            last_name: 1,
            photo_url: 1,
          },
        },
      },
    },
  ]);

  for (const song of songs)
    song.play_count = await Listening.countDocuments({ song: song._id });

  return songs;
};

const fetchSongByArtist = async (artist_id) => {
  const songs = await Song.find({ artist: artist_id })
    .lean()
    .populate({
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });

  for (const song of songs)
    song.play_count = await Listening.countDocuments({ song: song._id });
  return songs;
};

const fetchSongByArtistPaginate = async (artist_id, page = 1, limit = 10) => {
  const pagination = await Song.paginate(
    { artist: artist_id },
    {
      sort: { createdAt: -1 },
      page,
      limit,
      populate: [
        {
          path: "artist",
          select: "user display_name",
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

const incresasePlayCount = async (user_id, song_id) => {
  // Fetch user data
  const user = await User.findById(user_id);
  const length_before = user.history_listen.length;
  // Check if the song is already in the history_listen array
  const songIndex = user.history_listen.indexOf(song_id);
  if (songIndex !== -1) {
    // Remove the song from its current position
    user.history_listen.splice(songIndex, 1);
    user.history_listen.push(song_id);
  } else {
    // If song is not in history, add it
    user.history_listen.push(song_id);
  }

  const length_after = user.history_listen.length;
  if (length_after > length_before) {
    if (length_after % 5 === 0 || length_after === 1) {
      // khi thỏa mãn điều kiện, sẽ gọi đến API bên ngoài để lấy về 5 bài hát tương tự và thêm chúng vào playlist gợi ý
      await Axios.get(
        `https://mesik-recommendation.onrender.com/recommend?song_id=${song_id}`
      )
        .then(async (response) => {
          const list_songId = response.data.map((song) => song._id);
          const suggestedPlaylist = await Playlist.create({
            user: null,
            title: "Suggested Playlist",
            songs: list_songId,
          });
          await SuggestedPlaylist.create({
            user: user_id,
            playlist: suggestedPlaylist._id,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // Update user's history_listen array
  await User.findByIdAndUpdate(user_id, {
    $set: { history_listen: user.history_listen },
  });

  // Update song's play count
  const listening = await Listening.create({
    user: user_id,
    song: song_id,
  });
  return listening;
};

const addLyricToSong = async (song_id, lyric) => {
  await Song.findByIdAndUpdate(song_id, { lyric: lyric });
};

const getLyricsFromSong = async (song_id) => {
  const song = await Song.findById(song_id);
  return song.lyric;
};

const updateSong = async ({
  song_id,
  title,
  release_date,
  duration,
  genre,
  region,
  artist,
  isPremium,
}) => {
  const song = await Song.findByIdAndUpdate(
    song_id,
    {
      title: title,
      release_date: release_date,
      duration: duration,
      genre: genre,
      region: region,
      artist: artist,
      isPremium: isPremium,
    },
    { new: true }
  );

  return song;
};

export default {
  createSong,
  createSongByArtist,
  fetchSongs,
  fetchSongById,
  deleteSongById,
  fetch6SongsRelease,
  fetchRandomSongs,
  fetchSongByArtist,
  incresasePlayCount,
  addLyricToSong,
  getLyricsFromSong,
  updateSong,
  fetchSongByArtistPaginate,
};
