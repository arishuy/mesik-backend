import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/rankingController.js";

const router = express.Router();

router.get("/daily", controller.compareRanking);

export default router;
