import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/majorController.js";

const router = express.Router();

router.get("", controller.getAllMajors);
router.post("", auth, checkRole([roles.ADMIN]), controller.createMajor);
router.get("/:major_id", controller.getMajorById);
router.put(
  "/:major_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.updateMajor
);
router.delete(
  "/:major_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteMajor
);

export default router;
