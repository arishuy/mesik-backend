import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/songController.js";
import { uploadImage, uploadMulti } from "../middlewares/upload.js";
import trimRequest from "trim-request";

const router = express.Router();

router.get("/release", controller.fetch5SongsRelease);
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
router.get("", auth, checkRole([roles.ADMIN]), controller.getSongs);
router.get("/:song_id", auth, checkRole([roles.ADMIN]), controller.getSongById);
router.delete(
  "/:song_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteSong
);

export default router;
