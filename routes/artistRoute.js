import express from "express";
import artistController from "../controllers/artistController.js";

const router = express.Router();

router.get("/top-5-artist", artistController.get5Artists);
router.post("/", artistController.createArtist);
router.get("/", artistController.getArtists);
router.get("/:artist_id", artistController.getArtistById);
router.delete("/:artist_id", artistController.deleteArtist);
router.get("/:artist_id/related", artistController.getRelatedArtists);

export default router;
