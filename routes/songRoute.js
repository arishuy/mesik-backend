import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/songController.js";

const router = express.Router();

router.post("", auth, checkRole([roles.ADMIN]), controller.createSong);
router.get("", auth, checkRole([roles.ADMIN]), controller.getSongs);
router.get("/:song_id", auth, checkRole([roles.ADMIN]), controller.getSongById);
router.delete(
  "/:song_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteSong
);

export default router;
