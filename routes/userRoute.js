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
router.get(
  "/current/request",
  auth,
  checkRole([roles.USER]),
  controller.getMyRequest
);
router.get(
  "/current/favourite/:song_id",
  auth,
  checkRole([roles.USER, roles.ARTIST, roles.ADMIN]),
  controller.addOrRemoveSongToLikedSong
);
router.get(
  "/current/favourite",
  auth,
  checkRole([roles.USER, roles.ARTIST, roles.ADMIN]),
  controller.getLikedSongs
);
router.get("/current", auth, controller.getCurrentUserInfo);
router.get(
  "/current/history-listen",
  auth,
  checkRole([roles.ADMIN, roles.USER, roles.ARTIST]),
  controller.getHistoryListen
);
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
  "/current/promote-to-artist",
  auth,
  checkRole([roles.USER]),
  controller.promoteToArtist
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

router.get("/current/follow/:artist_id", auth, controller.followArtist);
router.get("/:id", controller.getUserById);
router.get("/current/following", auth, controller.getFollowing);
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
router.post(
  "/premium-package/:premiumPackage_id",
  auth,
  checkRole([roles.USER, roles.ARTIST]),
  controller.buyPremiumPackage
);

export default router;
