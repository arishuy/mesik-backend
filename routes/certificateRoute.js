import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/certificateController.js";
import { uploadImage } from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "",
  auth,
  checkRole([roles.EXPERT]),
  uploadImage.single("photo"),
  controller.createCertificate
);
router.delete(
  "/:certificate_id",
  auth,
  checkRole([roles.EXPERT]),
  controller.deleteCertificate
);
router.put(
  "/:certificate_id/verify",
  auth,
  checkRole([roles.ADMIN]),
  controller.verifyCertificate
);

export default router;
