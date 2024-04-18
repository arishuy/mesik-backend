import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/userController.js";
import { uploadImage } from "../middlewares/upload.js";
import trimRequest from "trim-request";
import validate from "../middlewares/yupValidation.js";
import schemas from "../validations/userValidations.js";

const router = express.Router();

router.get("", auth, checkRole([roles.ADMIN]), controller.getUsersPagination);
router.get("/current", auth, controller.getCurrentUserInfo);
router.put(
  "/current",
  auth,
  uploadImage.single("photo"),
  trimRequest.all,
  validate(schemas.updateUserInfoSchema),
  controller.updateUserInfo
);
router.put(
  "/current/password",
  auth,
  trimRequest.all,
  validate(schemas.changePasswordSchema),
  controller.changePassword
);
router.post(
  "/current/promote-to-expert",
  auth,
  checkRole([roles.USER]),
  controller.promoteToExpert
);
router.get(
  "/current/job_requests",
  auth,
  controller.getJobRequestsPaginationOfCurrentUser
);
router.get(
  "/current/transactions",
  auth,
  controller.getCurrentUserTransactions
);
router.get(
  "/current/notifications",
  auth,
  controller.getCurrentUserNotifications
);
router.put(
  "/current/notifications/:notification_id/seen",
  auth,
  controller.updateSeenNotification
);
router.get("/:id", controller.getUserById);
router.put(
  "/:id",
  auth,
  checkRole([roles.ADMIN]),
  trimRequest.all,
  validate(schemas.updateUserInfoSchema),
  uploadImage.single("photo"),
  controller.updateUserInfoById
);
router.delete(
  "/:user_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteUser
);
router.put(
  "/:user_id/enable",
  auth,
  checkRole([roles.ADMIN]),
  controller.enableUser
);
router.put(
  "/:user_id/disable",
  auth,
  checkRole([roles.ADMIN]),
  controller.disableUser
);
router.get(
  "/:user_id/job_requests",
  auth,
  controller.getJobRequestsPaginationByUserId
);

export default router;
