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

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", async (req, res) => {
  const responses = req.body;
  let newRoomId;

  //save original picture
  const originalCdn = "https://d2mh6uqojgaomb.cloudfront.net/";
  const parts = responses[0].wallImage.split("/");
  const originalImage =
    originalCdn + parts[parts.length - 1].split("_").slice(1).join("_");

  try {
    if (!responses[0].isOriginImage) {
      await saveWallOriginal(
        originalImage,
        responses[0].gym,
        responses[0].wall
      );
    }

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const roomId = `${response.gym}_${response.wall}_${response.color}`;
      const wallUpdateTime = new Date(response.wallUpdateTime);
      const wallChangeTime = new Date(response.wallChangeTime);

      if (response.keepImage) {
        const saveRoom = new RoomCounter({
          unique_id: roomId + "_" + new Date(),
          roomId: roomId,
        });

        let newRoom = await saveRoom.save();
        newRoomId = newRoom._id.toString();

        //save the other in mysql
        await createRoom(
          response.wallImage,
          response.officialLevel,
          response.gym,
          response.wall,
          response.color,
          newRoomId,
          wallUpdateTime,
          wallChangeTime
        );

        for (let i = 0; i < response.tags.length; i++) {
          const saveTag = new TagRoom({
            roomNumericId: newRoomId,
            tag: response.tags[i],
            tagCount: 1,
          });
          await saveTag.save();
        }
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let tagRoomId = req.query.roomId;
    const roomInformation = await getRoom(tagRoomId);

    let roomTagPair = await TagRoom.find({
      roomNumericId: tagRoomId,
    }).select("tag tagCount -_id");
    const wallImage = roomInformation.wallimage;
    const roomName = `${roomInformation.gym_id} ${roomInformation.wall} ${roomInformation.color}`;
    const officialLevel = roomInformation.official_level;
    const wallUpdateDate = roomInformation.wall_update_time;
    const wallChangeDate = roomInformation.wall_change_time;

    const sortedData = roomTagPair.sort((a, b) => b.tagCount - a.tagCount); //not validate yet
    const tagsArray = sortedData.map((item) => item.tag);

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
  const { wall, gym } = req.query;

  let search;
  switch (true) {
    case wall === "" && gym === "":
      search = `1=1`;
      break;
    case wall === "":
      search = `wall=wall and gym_id="${gym}"`;
      break;
    case gym === "":
      search = `wall="${wall}" and gym_id=gym_id`;
      break;
    default:
      search = `wall="${wall}" and gym_id="${gym}"`;
      break;
  }

  const originalwall = await getWallOriginal(search);
  res.status(200).json(originalwall);
});

export default router;
