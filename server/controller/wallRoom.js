import { RoomCounter } from "../models/chat-model.js";
import TagRoom from "../models/tagroom-model.js";
import {
  createRoom,
  saveWallOriginal,
  getRoom,
} from "../models/wallroom-model.js";

export async function createOriginalWall(wallrooms) {
  if (wallrooms[0].isOriginImage) {
    const originalCdn = "https://d2mh6uqojgaomb.cloudfront.net/";
    let originalImage;
    if (wallrooms.length > 0 && wallrooms[0].wallImage) {
      const parts = wallrooms[0].wallImage.split("/");
      if (parts.length > 1) {
        const lastPart = parts[parts.length - 1];
        const splitLastPart = lastPart.split("_");
        if (splitLastPart.length > 1) {
          originalImage = originalCdn + splitLastPart.slice(1).join("_");
        }
      }
    }
    try {
      if (originalImage) {
        await saveWallOriginal(
          originalImage,
          wallrooms[0].gym,
          wallrooms[0].wall
        );
      }
      console.log("Saved original wall");
      return "Saved original wall";
    } catch (err) {
      console.log("Server Error: " + err);
      return "Server Error";
    }
  }
  return "Not original wall";
}

export async function createOneWallroom(wallroom) {
  if (wallroom.keepImage) {
    const roomId = `${wallroom.gym}_${wallroom.wall}_${wallroom.color}`;
    const wallUpdateTime = new Date(wallroom.wallUpdateTime);
    const wallChangeTime = new Date(wallroom.wallChangeTime);

    const saveRoom = new RoomCounter({
      unique_id: roomId + "_" + new Date(),
      roomId: roomId,
    });
    const newRoom = await saveRoom.save();
    const newRoomId = newRoom._id.toString();

    await createRoom(
      wallroom.wallImage,
      wallroom.officialLevel,
      wallroom.gym,
      wallroom.wall,
      wallroom.color,
      newRoomId,
      wallUpdateTime,
      wallChangeTime,
      wallroom.creator
    );

    let tagRooms = wallroom.tags.map((tag) => ({
      roomNumericId: newRoomId,
      tag: tag,
      tagCount: 1,
    }));
    await TagRoom.insertMany(tagRooms);

    return "Saved wallroom";
  }
  return "Wallroom not keeped";
}

export async function getOneWallroom(request) {
  const tagRoomId = request.roomId;
  const today = new Date();
  const roomInformation = await getRoom(tagRoomId, today);

  if (!roomInformation) {
    return res.status(400).json("Wallroom do not exist");
  }

  let roomTagPair = await TagRoom.find({
    roomNumericId: tagRoomId,
  }).select("tag tagCount -_id");

  const {
    wallimage: wallImage,
    gym_id: gymId,
    wall,
    color,
    official_level: officialLevel,
    wall_update_time: wallUpdateDate,
    wall_change_time: wallChangeDate,
  } = roomInformation;
  const roomName = `${gymId} ${wall} ${color}`;

  let tagsArray = [];
  if (roomTagPair.length > 0) {
    const sortedData = roomTagPair.sort((a, b) => b.tagCount - a.tagCount);
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

  return response;
}
