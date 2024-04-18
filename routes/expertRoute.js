import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/expertController.js";
import { uploadDocument } from "../middlewares/upload.js";

const router = express.Router();

router.get("", auth, controller.getExpertsPagination);
router.get("/top", controller.getTopExperts);
router.get(
  "/unverified",
  auth,
  checkRole([roles.ADMIN]),
  controller.getExpertsHavingUnverifiedCert
);
router.get(
  "/current",
  auth,
  checkRole([roles.EXPERT]),
  controller.getCurrentExpertInfo
);
router.get(
  "/current/majors",
  auth,
  checkRole([roles.EXPERT]),
  controller.getCurrentExpertVerifiedMajors
);
router.get(
  "/current/recommended-job-requests",
  auth,
  checkRole([roles.EXPERT]),
  controller.getRecommendedJobRequestsForCurrentExpert
);
router.delete(
  "/current/recommended-job-requests/:job_request_id",
  auth,
  checkRole([roles.EXPERT]),
  controller.deleteRecommendedJobRequest
);
router.get(
  "/current/accepted-job-requests",
  auth,
  checkRole([roles.EXPERT]),
  controller.getAcceptedJobRequests
);
router.get(
  "/current/withdrawal-requests",
  auth,
  checkRole([roles.EXPERT]),
  controller.getWithdrawalRequests
);
router.get(
  "/current/bank-account",
  auth,
  checkRole([roles.EXPERT]),
  controller.getCurrentExpertBankAccount
);
router.put(
  "/current/bank-account",
  auth,
  checkRole([roles.EXPERT]),
  controller.updateCurrentExpertBankAccount
);
router.get("/:id", auth, controller.getExpertById);
router.get(
  "/:expert_id/certificates",
  auth,
  controller.getCertificatesByExpertId
);
router.get("/:expert_id/majors", auth, controller.getVerifiedMajorsByExpertId);
router.get("/:expert_id/reviews", controller.getReviewsByExpertId);

router.post(
  "/:expert_id/documents",
  auth,
  checkRole([roles.ADMIN]),
  uploadDocument.single(["file"]),
  controller.createDocument
);
router.get(
  "/:expert_id/documents",
  auth,
  checkRole([roles.ADMIN]),
  controller.getDocumentsByExpertId
);
router.get(
  "/:expert_id/documents/:document_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.getDocumentById
);
router.put(
  "/:expert_id/documents/:document_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.updateDocument
);
router.delete(
  "/:expert_id/documents/:document_id",
  auth,
  checkRole([roles.ADMIN]),
  controller.deleteDocument
);

export default router;
