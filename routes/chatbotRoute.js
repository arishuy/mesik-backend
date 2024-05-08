import express from "express";
import controller from "../controllers/chatbotController.js";

const router = express.Router();

router.get("/thread", controller.createThread);
router.post("/message", controller.addMessage);

export default router;
