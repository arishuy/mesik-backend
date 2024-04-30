import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import logger from "./config/logger.js";
import cron from "node-cron";
import calculateAndSaveDailyListenings from "./utils/ranking.js";

import userService from "./services/userService.js";

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 3000;

// Lập lịch để chạy cron job vào 12:00 mỗi đêm (0 giờ, 0 phút, 0 giây)
cron.schedule(
  "0 0 0 * * *",
  async () => {
    console.log("Starting cron job to calculate and save daily listenings...");
    await calculateAndSaveDailyListenings();
    console.log("Cron job completed.");
  },
  {
    timezone: "Asia/Ho_Chi_Minh", // Đặt múi giờ (timezone) cho cron job
  }
);

async function main() {
  // connect database
  await mongoose
    .connect(CONNECTION_URL)
    .then(() => logger.info("Connected to MongoDB"))
    .catch((err) => logger.error(err));

  // init first admin
  const admin = await userService.initAdmin();

  app.listen(PORT, () => {
    logger.info(`Listening to port ${PORT}`);
  });
}

main().catch((err) => logger.error(err));
