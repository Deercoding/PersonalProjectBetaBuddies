import express from "express";
import { BoulderingChat } from "../models/chat-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  try {
    let tagRoomId = req.query.roomId;
    let roomChatHist = await BoulderingChat.find({
      roomNumericId: tagRoomId,
    }).select("userName content -_id");
    res.status(200).json(roomChatHist);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

export default router;
