import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/songController.js";
import { uploadImage, uploadMulti } from "../middlewares/upload.js";
import trimRequest from "trim-request";

const router = express.Router();

router.get("/artist/:artist_id", controller.fetchSongByArtist);
router.get("/release", controller.fetch5SongsRelease);
router.get("/new-release", controller.fetchNewRelease);
router.get("/random", controller.fetchRandomSongs);
router.get("/lyric/:song_id", controller.getLyricsFromSong);
router.post("/next-play", controller.addSongToPlaying);
router.post(
  "/lyric/:song_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.addLyricToSong
);
router.post(
  "/play",
  auth,
  checkRole([roles.USER, roles.ARTIST, roles.ADMIN]),
  controller.incresasePlayCount
);
router.post(
  "",
  auth,
  checkRole([roles.ADMIN]),
  uploadImage.single("photo"),
  trimRequest.all,
  controller.createSong
);
router.post(
  "/upload-by-artist",
  auth,
  checkRole([roles.ARTIST]),
  uploadImage.single("photo"),
  trimRequest.all,
  controller.createSongByArtist
);
router.get("", auth, checkRole([roles.ADMIN]), controller.getSongs);
router.get("/:song_id", auth, checkRole([roles.ADMIN]), controller.getSongById);
router.delete(
  "/:song_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteSong
);
router.put(
  "/:song_id",
  auth,
  checkRole([roles.ADMIN]),
  trimRequest.all,
  controller.updateSong
);
// artist
router.put(
  "/artist/:song_id",
  auth,
  checkRole([roles.ARTIST]),
  controller.updateSongByArtist
);
router.delete(
  "/artist/:song_id",
  auth,
  checkRole([roles.ARTIST]),
  controller.updateSongByArtist
);
router.post(
  "/artist/lyric/:song_id",
  auth,
  checkRole([roles.ARTIST]),
  controller.addLyricToSongByArtist
);

export default router;
