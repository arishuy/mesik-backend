import express from "express";
import searchController from "../controllers/searchController.js";

const router = express.Router();

router.post("/", searchController.searchByAll);
router.get("/keywords", searchController.get5Keywords);
router.get("/keywords/:keyword", searchController.getRelatedKeywords);

export default router;
