import express, { response } from "express";
import path from "path";
import url from "url";
import { RoomCounter } from "../models/chat-model.js";
import TagRoom from "../models/tagroom-model.js";
import {
  createRoom,
  saveWallOriginal,
  getRoom,
  getWallOriginal,
} from "../models/wallroom-model.js";
import { wallCreateValidation } from "../utils/dataValidation.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", async (req, res) => {
  if (req.body.length == 0) {
    return res.status(400).json("請填入資料再送出聊天室");
  }
  const responses = req.body;
  const { error } = wallCreateValidation(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  console.log(responses[0].isOriginImage);
  if (responses[0].isOriginImage == true) {
    const originalCdn = "https://d2mh6uqojgaomb.cloudfront.net/";
    let originalImage;
    if (responses.length > 0 && responses[0].wallImage) {
      const parts = responses[0].wallImage.split("/");
      console.log(parts);
      if (parts.length > 1) {
        const lastPart = parts[parts.length - 1];
        const splitLastPart = lastPart.split("_");
        if (splitLastPart.length > 1) {
          originalImage = originalCdn + splitLastPart.slice(1).join("_");
          console.log(originalImage);
        }
      }
    }
    try {
      if (originalImage) {
        await saveWallOriginal(
          originalImage,
          responses[0].gym,
          responses[0].wall
        );
      }
      console.log("save");
    } catch (err) {
      console.log(err);
      res.status(500).json("Server error");
    }
  }

  let newRoomId;
  try {
    for (const response of responses) {
      if (response.keepImage) {
        const roomId = `${response.gym}_${response.wall}_${response.color}`;
        const wallUpdateTime = new Date(response.wallUpdateTime);
        const wallChangeTime = new Date(response.wallChangeTime);

        const saveRoom = new RoomCounter({
          unique_id: roomId + "_" + new Date(),
          roomId: roomId,
        });
        let newRoom = await saveRoom.save();
        newRoomId = newRoom._id.toString();

        await createRoom(
          response.wallImage,
          response.officialLevel,
          response.gym,
          response.wall,
          response.color,
          newRoomId,
          wallUpdateTime,
          wallChangeTime,
          response.creator
        );

        for (const tags of response.tags) {
          const saveTag = new TagRoom({
            roomNumericId: newRoomId,
            tag: tags,
            tagCount: 1,
          });
          await saveTag.save();
        }
      }
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
    const tagRoomId = req.query.roomId;
    const today = new Date(Date.now());
    const roomInformation = await getRoom(tagRoomId, today);

    if (!roomInformation) {
      return res.status(400).json("Wallroom do not exist");
    }

    let roomTagPair = await TagRoom.find({
      roomNumericId: tagRoomId,
    }).select("tag tagCount -_id");
    const wallImage = roomInformation.wallimage;
    const roomName = `${roomInformation.gym_id} ${roomInformation.wall} ${roomInformation.color}`;
    const officialLevel = roomInformation.official_level;
    const wallUpdateDate = roomInformation.wall_update_time;
    const wallChangeDate = roomInformation.wall_change_time;

    let tagsArray = [];
    if (roomTagPair.length > 0) {
      const sortedData = roomTagPair.sort((a, b) => b.tagCount - a.tagCount); //not validate yet
      tagsArray = sortedData.map((item) => item.tag);
    }

    const tags = tagsArray;
    const response = {
      wallImage,
      roomName,
      officialLevel,
      tags,
      wallUpdateDate,
      wallChangeDate,
    };
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/originalwall", async (req, res) => {
  //gym_id and wall
  const { gym } = req.query;
  const originalwall = await getWallOriginal(gym);
  res.status(200).json(originalwall);
});

export default router;
