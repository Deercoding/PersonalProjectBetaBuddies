import express, { response } from "express";
import path from "path";
import url from "url";
import { RoomCounter } from "../models/chat-model.js";
import TagRoom from "../models/tagroom-model.js";
import {
  createRoom,
  saveWallOriginal,
  getRoom,
} from "../models/wallroom-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", async (req, res) => {
  // {
  //   wallImage: 'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg',
  //   color: 'green',
  //   officialLevel: '',
  //   tags: [ '指力', '動態', '勾腳' ],
  //   gym: '岩館一',
  //   wall: 'AB牆',
  //   keepImage: false
  // }
  const responses = req.body;
  let newRoomId;

  //save original picture
  const originalCdn = "https://d2mh6uqojgaomb.cloudfront.net/";
  const parts = responses[0].wallImage.split("/");
  const originalImage =
    originalCdn + parts[parts.length - 1].split("_").slice(1).join("_");

  try {
    await saveWallOriginal(originalImage, responses[0].gym, responses[0].wall);

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
    console.log(err);
  }
});

router.post("/detail", async (req, res) => {
  //{ tagRoomId: '岩館一 AB牆 green' }
  //   {wallImage: 'https://d3ebcb0pef2qqe.cloudfront.net/green_AB wall crop new.jpg_1700748617487.jpg',
  // roomName: "岩館一 AB牆 green"
  // officialLevel: '2',
  // tags: [ '指力', '動態', '勾腳' ],
  // }

  let tagRoomId = req.body.roomId;
  const roomInformation = await getRoom(tagRoomId);
  console.log(roomInformation);

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

  // [
  //   {
  //     wallroomId: 4,
  //     wallimage: 'https://d3ebcb0pef2qqe.cloudfront.net/light_blue_LM wall crop.jpg_1700748931781.jpg',
  //     official_level: '',
  //     gym_id: '岩館一',
  //     wall: 'AB牆',
  //     color: 'light',
  //     tag_room_id: '6560a3e10af62270d916eeb4'
  //   }
  // ]
  // [
  //   {
  //     _id: new ObjectId('6560a3e10af62270d916eeb6'),
  //     roomNumericId: '6560a3e10af62270d916eeb4',
  //     tag: '指力',
  //     tagCount: 1,
  //     __v: 0
  //   }
  // ]
});
export default router;
