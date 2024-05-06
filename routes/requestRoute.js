import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/requestController.js";

const router = express.Router();

router.post("", auth, checkRole([roles.ADMIN]), controller.createRequest);
router.put(
  "/:request_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.updateRequestById
);
router.get(
  "",
  auth,
  checkRole([roles.ADMIN, roles.ARTIST]),
  controller.getRequests
);
router.get(
  "/:request_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.getRequestById
);
router.delete(
  "/:request_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteRequest
);

router.post(
  "/:request_id/accept",
  auth,
  checkRole([roles.ADMIN]),
  controller.approveRequestById
);

router.post(
  "/:request_id/reject",
  auth,
  checkRole([roles.ADMIN]),
  controller.rejectRequestById
);

export default router;
