import { Listening, Song } from "../models/index.js";
import rankingService from "../services/rankingService.js";
const calculateAndSaveDailyListenings = async () => {
  try {
    // Xác định ngày hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Tính số lượt nghe của mỗi bài hát trong ngày hiện tại
    const listenings = await Listening.aggregate([
      {
        $match: {
          listen_at: {
            $gte: today, // Lấy từ 00:00:00 hôm nay
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Đến 00:00:00 ngày mai
          },
        },
      },
      {
        $group: {
          _id: "$song",
          total_listenings: { $sum: 1 },
        },
      },
    ]);
    console.log(listenings);
    // Lưu số lượt nghe vào cơ sở dữ liệu
    for (const listening of listenings) {
      const { _id: songId, total_listenings: playCount } = listening;
      console.log(`Bài hát ${songId} có ${playCount} lượt nghe.`);
      // Kiểm tra xem có bài hát nào trong cơ sở dữ liệu không
      const song = await Song.findById(songId);
      if (!song) {
        console.log(`Không tìm thấy bài hát với ID ${songId}`);
        continue; // Bỏ qua nếu không tìm thấy bài hát
      }
      // Lưu số lượt nghe của bài hát vào cơ sở dữ liệu
      song.play_count_daily = playCount;
      await song.save();
      console.log(
        `Đã cập nhật số lượt nghe cho bài hát ${song.title}: ${playCount}`
      );
    }
    console.log(
      "Hoàn thành tính toán và lưu số lượt nghe mỗi bài hát mỗi ngày."
    );

    // tạo ranking_today với 10 bài hát có số lượt nghe cao nhất
    await rankingService.updateDailyRanking();
  } catch (error) {
    console.error("Lỗi trong quá trình tính toán và lưu số lượt nghe:", error);
  }
};

export default calculateAndSaveDailyListenings;
