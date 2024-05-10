import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import controller from "../controllers/suggestedPlaylistController.js";

const router = express.Router();

router.get("", auth, controller.getSuggestedPlaylistByUserId);
router.put("/:suggested_playlist_id", auth, controller.addToMyPlaylist);

export default router;
