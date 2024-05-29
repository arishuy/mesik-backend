import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/albumController.js";
import { uploadImage } from "../middlewares/upload.js";
import trimRequest from "trim-request";

const router = express.Router();
router.get("/top-4-album", controller.getFamousAlbums);
router.post(
  "",
  uploadImage.single("photo"),
  trimRequest.all,
  controller.createAlbum
);
router.get("/:album_id", controller.getAlbumById);
router.get("", auth, checkRole([roles.ADMIN]), controller.getAlbums);
router.get("/artist/:artist_id", controller.fetchAlbumByArtist);
router.delete(
  "/:album_id",
  auth,
  checkRole([roles.ARTIST, roles.ADMIN]),
  controller.deleteAlbum
);
router.post(
  "/play",
  auth,
  checkRole([roles.USER, roles.ARTIST, roles.ADMIN]),
  controller.incresasePlayCount
);

router.put(
  "/:album_id",
  auth,
  checkRole([roles.ARTIST]),
  uploadImage.single("photo"),
  trimRequest.all,
  controller.updateAlbumByArtist
);

export default router;
