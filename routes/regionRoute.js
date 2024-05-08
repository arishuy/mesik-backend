import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/regionController.js";

const router = express.Router();

router.post("", auth, checkRole([roles.ADMIN]), controller.createRegion);
router.put(
  "/:region_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.updateRegionById
);
router.get(
  "",
  auth,
  checkRole([roles.ADMIN, roles.ARTIST]),
  controller.getRegions
);
router.get(
  "/:region_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.getRegionById
);
router.delete(
  "/:region_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteRegion
);

export default router;
