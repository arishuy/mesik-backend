import express from "express";
import genreController from "../controllers/genreController.js";

const router = express.Router();

router.post("/", genreController.createGenre);
router.get("/", genreController.getAllGenres);
router.get("/:id", genreController.getGenreById);
router.put("/:id", genreController.updateGenre);
router.delete("/:id", genreController.deleteGenre);

export default router;
