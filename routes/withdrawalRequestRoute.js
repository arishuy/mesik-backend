import express from "express";
import { auth, checkRole } from "../middlewares/authorization.js";
import { roles } from "../config/constant.js";
import controller from "../controllers/withdrawalRequestController.js";

const router = express.Router();

router.post(
    "",
    auth,
    checkRole([roles.EXPERT]),
    controller.createWithdrawalRequest
);
router.get(
    "",
    auth,
    checkRole([roles.ADMIN]),
    controller.getWithdrawalRequests
);
router.get(
    "/:id",
    auth,
    checkRole([roles.EXPERT, roles.ADMIN]),
    controller.getWithdrawalRequestById
);
router.post(
    "/:id/fulfill",
    auth,
    checkRole([roles.ADMIN]),
    controller.fulfillWithdrawalRequest
);
router.post(
    "/:id/cancel",
    auth,
    checkRole([roles.ADMIN]),
    controller.cancelWithdrawalRequest
);

export default router;
