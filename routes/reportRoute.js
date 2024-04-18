import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/reportController.js";
import { uploadImage } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "",
  auth,
  checkRole([roles.USER, roles.EXPERT]),
  uploadImage.single("photo"),
  controller.createReport
);
router.get("", auth, checkRole([roles.ADMIN]), controller.getReports);
router.get(
  "/:report_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.getReportById
);
router.delete(
  "/:report_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteReport
);

export default router;
