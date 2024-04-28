import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/songController.js";
import { uploadImage, uploadMulti } from "../middlewares/upload.js";
import trimRequest from "trim-request";

const router = express.Router();

router.get("/artist/:artist_id", controller.fetchSongByArtist);
router.get("/release", controller.fetch5SongsRelease);
router.get("/random", controller.fetchRandomSongs);
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
  uploadMulti.fields([
    { name: "file", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  trimRequest.all,
  controller.createSong
);
router.post(
  "/upload-by-artist",
  auth,
  checkRole([roles.ARTIST]),
  uploadMulti.fields([
    { name: "file", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
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

export default router;
