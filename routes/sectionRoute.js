import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/sectionController.js";

const router = express.Router();

router.post("", auth, checkRole([roles.ADMIN]), controller.createSection);
router.put(
  "/:section_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.updateSectionById
);
router.get(
  "",
  auth,
  checkRole([roles.ADMIN, roles.ARTIST]),
  controller.getSections
);
router.get(
  "/:section_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.getSectionById
);
router.delete(
  "/:section_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteSection
);

export default router;
