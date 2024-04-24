import express from "express";
import artistController from "../controllers/artistController.js";

const router = express.Router();

router.get("/top-5-artist", artistController.get5Artists);
router.post("/", artistController.createArtist);
router.get("/", artistController.getArtists);
router.get("/:id", artistController.getArtistById);
router.delete("/:id", artistController.deleteArtist);

export default router;
