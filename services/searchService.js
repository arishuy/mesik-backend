import { Song, Artist, KeyWord, Listening } from "../models/index.js";

const searchByAll = async (keyword) => {
  try {
    const songs = await Song.find({ title: { $regex: keyword, $options: "i" } })
      .populate({
        path: "artist",
        select: "user display_name",
        populate: {
          path: "user",
          select: "first_name last_name photo_url",
        },
      })
      .select("-__v")
      .limit(6);

    for (const song of songs)
      song.play_count = await Listening.countDocuments({ song: song._id });

    // Tìm kiếm nghệ sĩ
    const artists = await Artist.find({
      display_name: { $regex: keyword, $options: "i" },
    })
      .populate("user", "first_name last_name photo_url")
      .select("-__v");
    // if keyword is not found in database, create a new keyword
    const keywordFound = await KeyWord.findOne({ keyword: keyword });
    if (!keywordFound) {
      await KeyWord.create({ keyword: keyword });
    } else {
      await KeyWord.updateOne({ keyword: keyword }, { $inc: { count: 1 } });
    }
    return { songs, artists };
  } catch (error) {
    throw error;
  }
};

const get5Keywords = async () => {
  try {
    const keywords = await KeyWord.find().sort({ count: -1 }).limit(5);
    return keywords;
  } catch (error) {
    throw error;
  }
};

export default {
  searchByAll,
  get5Keywords,
};
