import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import pushTokenRoute from "./pushTokenRoute.js";
import songRoute from "./songRoute.js";
import playlistRoute from "./playlistRoute.js";
import artistRoute from "./artistRoute.js";
import albumRoute from "./albumRoute.js";
import genreRoute from "./genreRoute.js";

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

export default router;
