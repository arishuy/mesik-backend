import { Listening, Ranking, Region, Song } from "../models/index.js";

const updateDailyRanking = async () => {
  try {
    // Lấy 10 bài hát có lượt nghe cao nhất trong ngày
    const todayTopSongs = await Song.find()
      .sort({ play_count_daily: -1 })
      .limit(10);

    // Tạo một bảng xếp hạng mới cho ngày hôm nay
    const todayRanking = new Ranking({
      date: new Date(),
      songs: todayTopSongs,
    });

    // Lưu bảng xếp hạng mới
    await todayRanking.save();
    console.log("Cập nhật bảng xếp hạng hàng ngày thành công.");
  } catch (error) {
    console.error("Lỗi khi cập nhật bảng xếp hạng hàng ngày:", error);
  }
};

const compareRanking = async () => {
  // so sanh 2 bang xep hang hom nay va hom qua
  const todayRanking = await Ranking.findOne()
    .sort({ date: -1 })
    .populate({
      path: "songs",
      select:
        "title artist photo_url duration file play_count_daily isPremium lyric",
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
  // Lay bang xep hang hom qua
  const yesterdayRanking = await Ranking.findOne()
    .sort({ date: -1 })
    .skip(1)
    .populate({
      path: "songs",
      select:
        "title artist photo_url duration file play_count_daily isPremium lyric",
      populate: [
        {
          path: "artist",
          select: "user",
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

  // tính toán sự thay đổi thứ hạng của từng bài hát ngày hôm nay so với ngày hôm qua
  const changedSongs = todayRanking.songs.map((song, index) => {
    const todayRank = index + 1;
    const yesterdayRank =
      yesterdayRanking.songs.findIndex(
        (pre_song) => pre_song._id.toString() === song._id.toString()
      ) + 1;
    if (yesterdayRank === 0) {
      return {
        song,
        todayRank,
        yesterdayRank: -1,
        rankChange: "NEW",
      };
    }
    const rankChange = yesterdayRank - todayRank;
    return {
      song,
      todayRank,
      yesterdayRank,
      rankChange,
    };
  });

  return changedSongs;
};

const vietnamRankings = async () => {
  // Vietnam chart
  const vn_region = await Region.findOne({ name: "Việt Nam" });

  if (!vn_region) {
    throw new Error("Region 'Việt Nam' not found");
  }

  // Aggregation pipeline for top songs in Vietnam
  const vnTopSongs = await Song.find({ region: vn_region._id })
    .sort({ play_count: -1 })
    .limit(10)
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

  return vnTopSongs;
};

const otherRegionRankings = async () => {
  const vn_region = await Region.findOne({ name: "Việt Nam" });

  if (!vn_region) {
    throw new Error("Region 'Việt Nam' not found");
  }

  // Aggregation pipeline for top songs in other regions
  const anotherTopSongs = await Song.find({ region: { $ne: vn_region._id } })
    .sort({ play_count: -1 })
    .limit(10)
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

  return anotherTopSongs;
};

export default {
  updateDailyRanking,
  compareRanking,
  vietnamRankings,
  otherRegionRankings,
};
