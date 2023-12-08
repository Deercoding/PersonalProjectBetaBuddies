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
  try {
    const { official_level, gym, searchtags } = req.query;

    let search = "";
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

    let tagRooms = [];
    if (searchtags != "") {
      tagRooms = await TagRoom.find({ tag: searchtags }).select(
        "tag roomNumericId tagCount -_id"
      );
    }

    let results = { data: [] };
    for (const searchResult of searchResults) {
      const tagRoomId = searchResult.tag_room_id;

      let isTagRoomPresent = true;
      if (searchtags != "") {
        isTagRoomPresent = tagRooms.some(
          (tagRoom) => tagRoom.roomNumericId === tagRoomId
        );
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
    results.data.sort((a, b) => b.roomChatCount - a.roomChatCount);

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/tags", async (req, res) => {
  try {
    const searchResults = await searchTags(
      client,
      "autocomplete-tagsearch-12030744",
      req.query.mysearch
    );

    let results = [];
    if (searchResults) {
      results = searchResults.map((result) => {
        return result._source.text;
      });
    }

    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
