import express from "express";
import artistController from "../controllers/artistController.js";

const router = express.Router();

router.post("/", artistController.createArtist);
router.get("/", artistController.getAllArtists);
router.get("/:id", artistController.getArtistById);
router.put("/:id", artistController.updateArtist);
router.delete("/:id", artistController.deleteArtist);

export default router;
