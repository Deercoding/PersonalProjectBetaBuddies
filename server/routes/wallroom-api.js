import express from "express";
import { getWallOriginal } from "../models/wallroom-model.js";
import { wallCreateValidation } from "../utils/dataValidation.js";
import {
  createOneWallroom,
  createOriginalWall,
  getOneWallroom,
} from "../controller/wallRoom.js";
import { routerSetup } from "../middleware/routerSetup.js";
const router = routerSetup();

router.post("/", async (req, res) => {
  try {
    if (req.body.length == 0) {
      return res.status(400).json("請填入資料再送出聊天室");
    }
    const wallrooms = req.body;
    const { error } = wallCreateValidation(wallrooms);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    await createOriginalWall(wallrooms);
    for (const wallroom of wallrooms) {
      await createOneWallroom(wallroom);
    }
    res.status(200).json("建立聊天室成功");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    if (!req.query.roomId) {
      return res.status(400).json("Please provide wallroom id");
    }
    const getOneWallroomResult = await getOneWallroom(req.query);
    res.status(200).json(getOneWallroomResult);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/originalwall", async (req, res) => {
  const { gym } = req.query;
  const originalwall = await getWallOriginal(gym);
  res.status(200).json(originalwall);
});

export default router;
