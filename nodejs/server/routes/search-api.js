import express from "express";
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

import { getRoombySearch } from "../models/wallroom-model.js";
import { BoulderingChat } from "../models/chat-model.js";
import { countVideos } from "../models/video-model.js";
import { searchTags } from "../utils/elastic-func.js";
import client from "../utils/elastic-client.js";
import TagRoom from "../models/tagroom-model.js";

router.get("/", async (req, res) => {
  let search = "";
  const params = req.query;
  const { official_level, gym, searchtags } = params;
  console.log(req.query);

  // in mysql search for official level & gym
  switch (true) {
    case official_level === "" && gym === "":
      search = `1=1`;
      break;
    case official_level === "":
      search = `official_level=official_level and gym_id="${gym}"`;
      break;
    case gym === "":
      search = `official_level="${official_level}" and gym_id=gym_id`;
      break;
    default:
      search = `official_level="${official_level}" and gym_id="${gym}"`;
      break;
  }
  const searchResults = await getRoombySearch(search);

  let tagRooms;
  // in mongo-db search for tag roooms
  if (searchtags != "") {
    tagRooms = await TagRoom.find({ tag: searchtags }).select(
      "tag roomNumericId tagCount -_id"
    );
  }

  let results = { data: [] };
  for (let i = 0; i < searchResults.length; i++) {
    const searchResult = searchResults[i];
    const tagRoomId = searchResult.tag_room_id;

    let isTagRoomPresent;
    if (searchtags != "") {
      isTagRoomPresent = tagRooms.some(
        (tagRoom) => tagRoom.roomNumericId === tagRoomId
      );
    } else {
      isTagRoomPresent = true;
    }

    if (isTagRoomPresent) {
      const wallroomId = searchResult.wallroomId;
      const roomChatCount = await BoulderingChat.countDocuments({
        roomNumericId: tagRoomId,
      });
      const videoCount = await countVideos(wallroomId);
      let tags = await TagRoom.find({ roomNumericId: tagRoomId }).select(
        "tag -_id"
      );
      tags = tags.map((tag) => tag.tag);

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
        tags: tags,
      };
      results.data.push(oneResult);
    }
  }

  //default sort by newest
  results.data.sort(
    (a, b) =>
      new Date(b.wallUpdateDate).getTime() -
      new Date(a.wallUpdateDate).getTime()
  );

  res.status(200).json(results);
});

router.post("/tags", async (req, res) => {
  const searchResults = await searchTags(
    client,
    "autocomplete-tagsearch-12030744",
    req.body.mysearch
  );

  let results;
  if (searchResults) {
    results = searchResults.map((result) => {
      return result._source.text;
    });
  }

  res.status(200).json(results);
});

export default router;
