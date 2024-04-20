import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import logger from "./config/logger.js";

import userService from "./services/userService.js";


dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 3000;

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
