import express, { response } from "express";
import multer from "multer";
import path from "path";
import url from "url";
import { uploadVideo } from "../utils/awsS3.js";
import { getRoomId } from "../models/wallroom-model.js";
import TagRoom from "../models/tagroom-model.js";
import { createVideo, getVideos } from "../models/video-model.js";
import {
  //checkWallinGame,
  //getUserinGame,
  getConnection,
  beginSQL,
  commitSQL,
  rollbackSQL,
  releaseConnection,
  lockGameUser,
  oneGameUserStatus,
  checkGameUserWalls,
  updateUserWallStatus,
  updateUserWallsCount,
  countgGamewallsbyId,
  gameMaxRank,
  updateUserWallsComplete,
  checkWallandUserinGame,
} from "../models/game-model.js";
import { betaCreateValidation } from "../utils/dataValidation.js";

const upload = multer({ dest: "public/videos/" });
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", upload.single("video"), async (req, res) => {
  console.log(req.body);
  const { error } = betaCreateValidation(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json(error.details[0].message);
  }

  if (!req.file) {
    return res.status(400).json("請上傳Beta影片");
  }

  const { roomNumericId, userId, userName, comments, levelByAuthor, tags } =
    req.body;
  const { originalname } = req.file;

  const videoSaveName = originalname + "_" + Date.now();
  const toFolder = __dirname;
  try {
    await uploadVideo(
      "videobouldering",
      req.file,
      videoSaveName,
      "ap-southeast-1",
      toFolder
    );

    const today = new Date(Date.now());
    const roomInformation = await getRoomId(roomNumericId, today);

    const wallroomId = roomInformation["wallroomId"];

    await createVideo(
      wallroomId,
      process.env.VIDEOS3_CDN + videoSaveName,
      comments,
      levelByAuthor,
      userId,
      userName,
      roomNumericId
    );

    for (let tag of tags) {
      const conditions = {
        roomNumericId: roomNumericId,
        tag: tag,
      };
      let roomTags = await TagRoom.find(conditions);
      if (roomTags.length > 0) {
        const update = { $inc: { tagCount: 1 } };
        await TagRoom.findOneAndUpdate(conditions, update, { upsert: true });
      } else {
        const saveTag = new TagRoom({
          roomNumericId: roomNumericId,
          tag: tag,
          tagCount: 1,
        });
        await saveTag.save();
      }
    }

    console.log("start game logic");
    //check game logic
    let gameUsers = await checkWallandUserinGame(roomNumericId, userId);
    if (gameUsers.length == 0) {
      return res.status(200).json("Not in Game. Beta video upload success");
    }

    for (const gameUser of gameUsers) {
      const oneGameId = gameUser.game_id;
      let connection = await getConnection();
      try {
        await beginSQL(connection);
        await lockGameUser(oneGameId, connection);

        //update walls
        const game_users_id = gameUser.game_users_id;
        let userWalls = await checkGameUserWalls(
          game_users_id,
          roomNumericId,
          connection
        );

        if (userWalls.length == 0) {
          await updateUserWallStatus(game_users_id, roomNumericId, connection);
          await updateUserWallsCount(game_users_id, connection);
        } else {
          await releaseConnection(connection);
          return res
            .status(200)
            .json("Ne update on wall count. Beta video upload success");
        }

        //rank
        let countGamewalls = await countgGamewallsbyId(oneGameId);
        countGamewalls = countGamewalls[0].count_walls;
        let oneUserOneGame = await oneGameUserStatus(
          oneGameId,
          userId,
          connection
        );

        if (oneUserOneGame.complete_walls_count == countGamewalls) {
          let maxRank = await gameMaxRank(oneGameId, connection);
          maxRank = maxRank.max_rank;

          if (maxRank > 0) {
            await updateUserWallsComplete(
              maxRank + 1,
              game_users_id,
              connection
            );
          } else {
            await updateUserWallsComplete(1, game_users_id, connection);
          }
        } else {
          await releaseConnection(connection);
          return res
            .status(200)
            .json("Ne update on rank. Beta video upload success");
        }

        await commitSQL(connection);
        await releaseConnection(connection);
      } catch (err) {
        console.log(err);
        await rollbackSQL(connection);
        await releaseConnection(connection);
      }
    }
    res.status(200).json("Beta video upload success");
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
    const roomInformation = await getRoomId(tagRoomId, today);

    if (!roomInformation) {
      return res.status(400).json("Wallroom do not exist");
    }

    const wallroomId = roomInformation.wallroomId;
    const videos = await getVideos(wallroomId);
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
