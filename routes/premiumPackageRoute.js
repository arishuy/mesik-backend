import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/premiumPackageController.js";

const router = express.Router();

router.post(
  "",
  auth,
  checkRole([roles.ADMIN]),
  controller.createPremiumPackage
);
router.put(
  "/:premiumPackage_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.updatePremiumPackageById
);
router.get(
  "",
  auth,
  checkRole([roles.ADMIN, roles.ARTIST, roles.USER]),
  controller.getPremiumPackages
);
router.get(
  "/:premiumPackage_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.getPremiumPackageById
);
router.delete(
  "/:premiumPackage_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deletePremiumPackage
);

export default router;
