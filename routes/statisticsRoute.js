import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/statisticsController.js";

const router = express.Router();

router.get(
  "/admin",
  auth,
  checkRole([roles.ADMIN]),
  controller.getStatisticsForAdmin
);
router.get(
  "/current-expert",
  auth,
  checkRole([roles.EXPERT]),
  controller.getStatisticsForExpert
);
router.get(
  "/income",
  auth,
  checkRole([roles.ADMIN]),
  controller.getTotalIncome
);
router.get(
  "/current-expert-income",
  auth,
  checkRole([roles.EXPERT]),
  controller.getExpertIncome
);

export default router;
