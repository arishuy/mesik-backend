import express from "express";
import playlistController from "../controllers/playlistController.js";

const router = express.Router();

router.post("/", playlistController.createPlaylist);
router.get("/", playlistController.getAllPlaylists);
router.get("/:id", playlistController.getPlaylistById);
router.put("/:id", playlistController.updatePlaylist);
router.delete("/:id", playlistController.deletePlaylist);

export default router;
