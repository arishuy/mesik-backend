import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/genreController.js";

const router = express.Router();

router.post("", auth, checkRole([roles.ADMIN]), controller.createGenre);
router.get(
  "",
  auth,
  checkRole([roles.ADMIN, roles.ARTIST]),
  controller.getGenres
);
router.get(
  "/:genre_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.getGenreById
);
router.delete(
  "/:genre_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteGenre
);

export default router;
