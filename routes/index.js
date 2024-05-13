import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import pushTokenRoute from "./pushTokenRoute.js";
import songRoute from "./songRoute.js";
import playlistRoute from "./playlistRoute.js";
import artistRoute from "./artistRoute.js";
import albumRoute from "./albumRoute.js";
import genreRoute from "./genreRoute.js";
import rankingRoute from "./rankingRoute.js";
import searchRoute from "./searchRoute.js";
import requestRoute from "./requestRoute.js";
import chatbotRoute from "./chatbotRoute.js";
import regionRoute from "./regionRoute.js";
import suggestedPlaylistRoute from "./suggestedPlaylistRoute.js";
import reportRoute from "./reportRoute.js";
import transactionRoute from "./transactionRoute.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/push-token", pushTokenRoute);
router.use("/songs", songRoute);
router.use("/playlists", playlistRoute);
router.use("/artists", artistRoute);
router.use("/albums", albumRoute);
router.use("/genres", genreRoute);
router.use("/artists", artistRoute);
router.use("/ranking", rankingRoute);
router.use("/reports", reportRoute);
router.use("/search", searchRoute);
router.use("/requests", requestRoute);
router.use("/chatbot", chatbotRoute);
router.use("/regions", regionRoute);
router.use("/transactions", transactionRoute);
router.use("/suggested-playlists", suggestedPlaylistRoute);

export default router;
