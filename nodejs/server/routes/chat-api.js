import express from "express";
import { BoulderingChat } from "../models/chat-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/history", async (req, res) => {
  let roomId = req.body.roomId;
  let roomChatHist = await BoulderingChat.find({ roomId: roomId });
  res.status(200).json(roomChatHist);
});

export default router;
