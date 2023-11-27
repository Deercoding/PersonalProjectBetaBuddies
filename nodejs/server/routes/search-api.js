import express from "express";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
import { getRoombySearch } from "../models/wallroom-model.js";
import { BoulderingChat } from "../models/chat-model.js";
import { countVideos } from "../models/video-model.js";

router.get("/", async (req, res) => {
  let search = "";
  const params = req.query;
  const { official_level, gym } = params;

  if (official_level == "" && gym == "") {
    search = `1=1`;
  } else if (official_level == "") {
    search = `official_level=official_level and gym_id="${gym}"`;
  } else if (gym == "") {
    search = `official_level="${official_level}" and gym_id=gym_id`;
  } else {
    search = `official_level="${official_level}"and gym_id="${gym}"`;
  }
  const searchResults = await getRoombySearch(search);

  let results = { data: [] };
  for (let i = 0; i < searchResults.length; i++) {
    const searchResult = searchResults[i];

    const tagRoomId = searchResult.tag_room_id;
    const wallroomId = searchResult.wallroomId;
    const roomChatCount = await BoulderingChat.countDocuments({
      roomNumericId: tagRoomId,
    });
    const videoCount = await countVideos(wallroomId);

    const oneResult = {
      wallimage: searchResult.wallimage,
      official_level: searchResult.official_level,
      gym_id: searchResult.gym_id,
      wall: searchResult.wall,
      color: searchResult.color,
      roomChatCount: roomChatCount,
      videoCount: videoCount.videoCount,
      roomNumericId: tagRoomId,
      wallUpdateDate: searchResult.wall_update_time,
      wallChangeDate: searchResult.wall_change_time,
    };
    results.data.push(oneResult);
  }
  //default sort by newest
  results.data.sort(
    (a, b) =>
      new Date(b.wallUpdateDate).getTime() -
      new Date(a.wallUpdateDate).getTime()
  );

  res.status(200).json(results);
});

export default router;
