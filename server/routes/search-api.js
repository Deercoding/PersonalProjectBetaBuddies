import express from "express";
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
import mongoose from "mongoose";
import {
  getMaxVideoRoom,
  getRoombyIds,
  getRoombySearch,
} from "../models/wallroom-model.js";
import { BoulderingChat } from "../models/chat-model.js";
import { countMultipleRoomVideos, countVideos } from "../models/video-model.js";
import { searchTags } from "../utils/elastic-func.js";
import client from "../utils/elastic-client.js";
import TagRoom from "../models/tagroom-model.js";
import { getGamebyRoom } from "../models/game-model.js";

router.get("/2.0", async (req, res) => {
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

    const tagRoomIds = searchResults.map(
      (searchResult) => new mongoose.Types.ObjectId(searchResult.tag_room_id)
    );

    const roomChatCounts = await BoulderingChat.aggregate([
      {
        $match: {
          roomNumericId: { $in: tagRoomIds },
        },
      },
      {
        $group: {
          _id: "$roomNumericId",
          chatCount: { $sum: 1 },
        },
      },
    ]);

    const wallRoomIds = searchResults.map(
      (searchResult) => searchResult.wallroomId
    );

    let MultipleRoomVideoCounts = await countMultipleRoomVideos(wallRoomIds);

    let tags = await TagRoom.find({
      roomNumericId: { $in: tagRoomIds },
    }).select("roomNumericId tag -_id");

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

        let roomChatCount = roomChatCounts.filter((oneRoom) => {
          return oneRoom._id.equals(new mongoose.Types.ObjectId(tagRoomId));
        });
        roomChatCount = roomChatCount.map((oneRoom) => oneRoom.chatCount);
        if (roomChatCount.length == 0) {
          roomChatCount = [0];
        }

        let videoCount = MultipleRoomVideoCounts.filter(
          (video) => video.wallroomId == wallroomId
        ).map((video) => video.videoCount);

        if (videoCount.length == 0) {
          videoCount = [0];
        }

        let tag = tags
          .filter((tag) => tag.roomNumericId == tagRoomId)
          .map((tag) => tag.tag);

        const oneResult = {
          wallimage: searchResult.wallimage,
          official_level: searchResult.official_level,
          gym_id: searchResult.gym_id,
          wall: searchResult.wall,
          color: searchResult.color,
          roomChatCount: roomChatCount[0],
          videoCount: videoCount[0],
          roomNumericId: tagRoomId,
          wallUpdateDate: searchResult.wall_update_time,
          wallChangeDate: searchResult.wall_change_time,
          tags: tag,
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

router.get("/creator", async (req, res) => {
  try {
    const { official_level, gym, creator } = req.query;

    let search = "";
    switch (true) {
      case official_level === "" && gym === "":
        search = `creator=${creator}`;
        break;
      case official_level === "":
        search = `official_level=official_level and gym_id="${gym}" and creator=${creator}`;
        break;
      case gym === "":
        search = `official_level="${official_level}" and gym_id=gym_id and creator=${creator}`;
        break;
      default:
        search = `official_level="${official_level}" and gym_id="${gym}" and creator=${creator}`;
        break;
    }

    const searchResults = await getRoombySearch(search);
    let results = { data: [] };
    for (const searchResult of searchResults) {
      const oneResult = {
        wallimage: searchResult.wallimage,
        official_level: searchResult.official_level,
        gym_id: searchResult.gym_id,
        wall: searchResult.wall,
        color: searchResult.color,
        roomNumericId: searchResult.tag_room_id,
        wallUpdateDate: searchResult.wall_update_time,
        wallChangeDate: searchResult.wall_change_time,
      };
      results.data.push(oneResult);
    }

    results.data.sort((a, b) => b.roomChatCount - a.roomChatCount);

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/maxvideorooms", async (req, res) => {
  try {
    let maxVideoRoom = await getMaxVideoRoom();
    maxVideoRoom = maxVideoRoom.map((room) => room.tag_room_id);
    let searchResults = await getRoombyIds(maxVideoRoom);

    let results = { data: [] };
    for (const searchResult of searchResults) {
      const tagRoomId = searchResult.tag_room_id;
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
    res.status(500).json(err);
  }
});

router.get("/gamerooms", async (req, res) => {
  try {
    const { roomId } = req.query;
    let games = await getGamebyRoom(roomId);
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json(err);
  }
});

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

export default router;
