import {
  Song,
  User,
  Artist,
  Listening,
  SuggestedPlaylist,
  Playlist,
  TokenizedLyrics,
  Region,
  Album,
} from "../models/index.js";
import cloudinaryService from "./cloudinaryService.js";
import { uploadAudio } from "../utils/aws.js";
import Axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const createSong = async ({
  title,
  release_date,
  duration,
  genre_id,
  region_id,
  artist_id,
  featuredArtists = [],
  file = "",
  photo,
  play_count = 0,
}) => {
  let response;
  let link;
  // if (file) {
  // name = title + current timestamp
  // const name = title + Date.now();
  // link = await uploadAudio(name, file);
  // }
  if (photo) {
    response = await cloudinaryService.upload(photo);
  }
  const song = await Song.create({
    title: title,
    release_date: release_date,
    duration: duration,
    file: file,
    genre: genre_id,
    region: region_id,
    artist: artist_id,
    featuredArtists: featuredArtists,
    photo_url: response ? response.url : null,
    photo_public_id: response ? response.public_id : null,
    play_count: play_count,
  });

  return song;
};

const createSongByArtist = async ({
  title,
  featuredArtists = [],
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
    featuredArtists: featuredArtists,
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
  return pagination;
};

const fetchAllSongs = async () => {
  const songs = await Song.find({})
    .populate({
      path: "artist",
      select: "user display_name",
    })
    .sort({ title: 1 });
  return songs;
};

const deleteSongById = async (song_id) => {
  await Song.deleteOne({ _id: song_id });
};

const fetch6SongsRelease = async () => {
  const songs = await Song.find({})
    .sort({ release_date: -1 })
    .limit(9)
    .lean()
    .populate({
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    })
    .populate({
      path: "featuredArtists",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });

  const vn_region = await Region.findOne({ name: "Việt Nam" });

  const songs_vn = await Song.find({ region: vn_region._id })
    .sort({ release_date: -1 })
    .limit(9)
    .lean()
    .populate({
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    })
    .populate({
      path: "featuredArtists",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });

  const another_songs = await Song.find({ region: { $ne: vn_region._id } })
    .sort({ release_date: -1 })
    .limit(9)
    .lean()
    .populate({
      path: "artist",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    })
    .populate({
      path: "featuredArtists",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });

  return { songs, songs_vn, another_songs };
};

const fetchRandomSongs = async () => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 6 } }, // Lấy ngẫu nhiên 6 bản ghi
      {
        $lookup: {
          from: "artists",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" },
      {
        $lookup: {
          from: "users",
          localField: "artist.user",
          foreignField: "_id",
          as: "artist.user",
        },
      },
      { $unwind: "$artist.user" },
      {
        $lookup: {
          from: "artists",
          localField: "featuredArtists",
          foreignField: "_id",
          as: "featuredArtists",
        },
      },
      {
        $unwind: {
          path: "$featuredArtists",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "featuredArtists.user",
          foreignField: "_id",
          as: "featuredArtists.user",
        },
      },
      {
        $unwind: {
          path: "$featuredArtists.user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: {
            _id: 1,
            display_name: 1,
            user: {
              first_name: 1,
              last_name: 1,
              photo_url: 1,
            },
          },
          featuredArtists: 1,
          play_count: 1,
          duration: 1,
          file: 1,
          isPremium: 1,
          photo_url: 1,
          lyric: 1,
        },
      },
    ]);

    return songs;
  } catch (error) {
    console.error("Error in fetchRandomSongs:", error);
    throw error;
  }
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
    })
    .populate({
      path: "featuredArtists",
      select: "user display_name",
      populate: {
        path: "user",
        select: "first_name last_name photo_url",
      },
    });
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
        {
          path: "featuredArtists",
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
  if (!user) {
    throw new Error("User not found");
  }
  const length_before = user.history_listen.length;
  // Check if the song is already in the history_listen array

  const songIndex = user.history_listen.indexOf(song_id);

  if (songIndex !== -1) {
    // If song is already in history, remove it
    user.history_listen.splice(songIndex, 1);
  }

  // Add song to the top of the history
  user.history_listen.unshift(song_id);

  // Save the updated user document
  await user.save();

  const length_after = user.history_listen.length;
  if (length_after > length_before) {
    if (length_after % 5 === 0 || length_after === 1) {
      // khi thỏa mãn điều kiện, sẽ gọi đến API bên ngoài để lấy về 5 bài hát tương tự và thêm chúng vào playlist gợi ý
      await Axios.get(
        // `https://mesik-recommendation.onrender.com/recommend?song_id=${song_id}`
        process.env.RECOMMEND_ENDPOINT + `/recommend?song_id=${song_id}`
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
  // Update song's play count
  const listening = await Listening.create({
    user: user_id,
    song: song_id,
  });

  const song = await Song.findById(song_id);
  song.play_count += 1;
  await song.save();
  return listening;
};

const addLyricToSong = async (song_id, lyric) => {
  await Song.findByIdAndUpdate(song_id, { lyric: lyric });
  const tokenizedLyrics = await Axios.post(
    // `https://mesik-lyrics.onrender.com/tokenize`,
    process.env.RECOMMEND_ENDPOINT + `/add_lyrics`,
    {
      id: song_id,
      lyric: lyric,
    }
  );
  await TokenizedLyrics.findOneAndUpdate(
    { song: song_id },
    { song: song_id, lyric: tokenizedLyrics.data.processed_lyrics },
    { upsert: true }
  );
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
  featuredArtists,
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
      featuredArtists: featuredArtists,
    },
    { new: true }
  );

  return song;
};

const updateSongByArtist = async ({
  user_id,
  song_id,
  title,
  release_date,
  duration,
  genre,
  region,
  artist,
  isPremium,
  featuredArtists,
}) => {
  const artist_id = await Artist.findOne({ user: user_id }).select("_id");
  if (!artist_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not an artist");
  }
  const song = await Song.findOne({ _id: song_id, artist: artist_id });
  if (!song) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Song not found");
  }
  song.title = title;
  song.release_date = release_date;
  song.duration = duration;
  song.genre = genre;
  song.region = region;
  song.artist = artist;
  song.isPremium = isPremium;
  song.featuredArtists = featuredArtists;

  await song.save();
  return song;
};

const addLyricToSongByArtist = async (user_id, song_id, lyric) => {
  const artist_id = await Artist.findOne({ user: user_id }).select("_id");
  if (!artist_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not an artist");
  }
  const song = await Song.findOne({ _id: song_id, artist: artist_id });
  if (!song) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Song not found");
  }
  song.lyric = lyric;
  await song.save();
  const tokenizedLyrics = await Axios.post(
    // `https://mesik-lyrics.onrender.com/tokenize`,
    process.env.RECOMMEND_ENDPOINT + `/add_lyrics`,
    {
      id: song_id,
      lyric: lyric,
    }
  );
  // create or update tokenized lyrics
  await TokenizedLyrics.findOneAndUpdate(
    { song: song_id },
    { song: song_id, lyric: tokenizedLyrics.data.processed_lyrics },
    { upsert: true }
  );
};

const deleteSongByArtist = async (user_id, song_id) => {
  const artist_id = await Artist.findOne({ user: user_id }).select("_id");
  if (!artist_id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not an artist");
  }
  await Song.deleteOne({ _id: song_id, artist: artist_id });
};

const addSongToPlaying = async (song_id) => {
  try {
    // Fetch the first song from the list to get the artist, genre, and region
    const song = await Song.findById(song_id[0]);
    if (!song) throw new Error("Song not found");

    // Fetch the artist details
    const artist = await Artist.findById(song.artist);
    if (!artist) throw new Error("Artist not found");

    let songs = await Song.find({
      artist: artist._id, // Match the artist
      region: song.region, // Match the region
      _id: { $nin: song_id }, // Exclude provided song IDs
      isPremium: false, // Exclude premium songs
    })
      .limit(9) // Limit to 9 songs
      .lean()
      .populate({
        path: "artist",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      })
      .populate({
        path: "featuredArtists", // Populate featuredArtists field
        select: "user display_name", // Select fields from Artist model
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      });

    // // If there are less than 9 songs by artist, fetch additional songs by genre
    // if (songs.length < 9) {
    // let songs = [];
    // // khi thỏa mãn điều kiện, sẽ gọi đến API bên ngoài để lấy về 5 bài hát tương tự và thêm chúng vào playlist gợi ý
    // try {
    //   const res = await Axios.get(
    //     process.env.RECOMMEND_ENDPOINT + `/recommend?song_id=${song_id}`
    //   );
    //   let list_songs = res.data.map((song) => song._id);
    //   songs = await Song.find({ _id: { $in: list_songs } })
    //     .lean()
    //     .populate({
    //       path: "artist",
    //       select: "user display_name",
    //       populate: {
    //         path: "user",
    //         select: "first_name last_name photo_url",
    //       },
    //     })
    //     .populate({
    //       path: "featuredArtists",
    //       select: "user display_name",
    //       populate: {
    //         path: "user",
    //         select: "first_name last_name photo_url",
    //       },
    //     });
    // } catch (error) {
    //   console.log(error);
    // }

    // Concatenate additional songs with songs by artist
    // songs = songs.concat(additionalSongs);
    // If there are less than 9 songs by artist, fetch additional songs by genre
    if (songs.length < 9) {
      const additionalSongs = await Song.find({
        genre: song.genre, // Match the genre
        artist: { $ne: artist._id }, // Exclude songs by the same artist
        region: song.region, // Match the region
        _id: { $nin: song_id }, // Exclude provided song IDs
        isPremium: false, // Exclude premium songs
      })
        .limit(9 - songs.length) // Limit to remaining required songs
        .lean()
        .populate({
          path: "artist",
          select: "user display_name",
          populate: {
            path: "user",
            select: "first_name last_name photo_url",
          },
        });

      // Concatenate additional songs with songs by artist
      songs = songs.concat(additionalSongs);
    }
    return songs;
  } catch (error) {
    console.error("Error in addSongToPlaying:", error);
    throw error; // Re-throw the error for further handling
  }
};

const fetchNewRelease = async (type) => {
  if (type === "song")
    return await Song.find({})
      .sort({ release_date: -1 })
      .limit(100)
      .populate({
        path: "artist",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      })
      .populate({
        path: "featuredArtists",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      })
      .populate({
        path: "region",
        select: "name",
      });
  else if (type === "album")
    return await Album.find({
      artist: { $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate({
        path: "artist",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      })
      .populate({
        path: "songs",
        select:
          "title photo_url file duration artist createdAt isPremium lyric release_date",
        populate: [
          {
            path: "artist",
            select: "user display_name",
            populate: {
              path: "user",
              select: "first_name last_name photo_url",
            },
          },
          {
            path: "featuredArtists",
            select: "user display_name",
            populate: {
              path: "user",
              select: "first_name last_name photo_url",
            },
          },
        ],
      });
  else return [];
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
  updateSongByArtist,
  addLyricToSongByArtist,
  deleteSongByArtist,
  fetchAllSongs,
  addSongToPlaying,
  fetchNewRelease,
};
