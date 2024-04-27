import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/playlistController.js";

const router = express.Router();

router.post(
  "",
  auth,
  checkRole([roles.ADMIN, roles.USER, roles.ARTIST]),
  controller.createPlaylist
);
router.post(
  "/add-song",
  auth,
  checkRole([roles.ADMIN, roles.USER, roles.ARTIST]),
  controller.addSongToPlaylist
);
router.get(
  "/current",
  auth,
  checkRole([roles.ADMIN, roles.USER, roles.ARTIST]),
  controller.getPlaylistByUser
);
router.get("", auth, checkRole([roles.ADMIN]), controller.getPlaylists);
router.get(
  "/:playlist_id",
  auth,
  checkRole([roles.ADMIN, roles.USER, roles.ARTIST]),
  controller.getPlaylistById
);
router.delete(
  "/:playlist_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deletePlaylist
);

export default router;
