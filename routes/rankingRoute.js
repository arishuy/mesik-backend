import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/rankingController.js";

const router = express.Router();

router.get("/daily", controller.compareRanking);
router.get("/vietnam", controller.vietnamRankings);
router.get("/other", controller.otherRegionRankings);

export default router;
