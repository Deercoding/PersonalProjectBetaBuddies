import express, { response } from "express";
import multer from "multer";
import path from "path";
import url from "url";
import { uploadVideo } from "../utils/awsS3.js";
import { getRoom } from "../models/wallroom-model.js";
import TagRoom from "../models/tagroom-model.js";
import { createVideo, getVideos } from "../models/video-model.js";
import {
  checkWallinGame,
  getUserinGame,
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
} from "../models/game-model.js";

const upload = multer({ dest: "public/videos/" });
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/", upload.single("video"), async (req, res) => {
  const { roomNumericId, userId, userName, comments, levelByAuthor, tags } =
    req.body;
  const { originalname } = req.file;
  const videoSaveName = originalname + "_" + Date.now();
  const toFolder = __dirname;

  try {
    let uploadVideoResult = uploadVideo(
      "videobouldering",
      req.file,
      videoSaveName,
      "ap-southeast-1",
      toFolder
    );

    const roomInformation = await getRoom(roomNumericId);
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

    for (let i = 0; i < tags.length; i++) {
      const conditions = {
        roomNumericId: roomNumericId,
        tag: tags[i],
      };

      let roomTagPair = await TagRoom.find(conditions);

      if (roomTagPair.length > 0) {
        const update = { $inc: { tagCount: 1 } };
        await TagRoom.findOneAndUpdate(conditions, update, { upsert: true });
      } else {
        const saveTag = new TagRoom({
          roomNumericId: roomNumericId,
          tag: tags[i],
          tagCount: 1,
        });
        await saveTag.save();
      }
    }

    //check game logic
    let gameIds = await checkWallinGame(roomNumericId);
    gameIds = gameIds.map((gameId) => gameId.game_id);
    console.log(gameIds);
    if (gameIds.length == 0) {
      return res.status(200).json("Not in Game. Beta video upload success");
    }

    const gameUserStatus = await getUserinGame(gameIds, userId);
    if (gameUserStatus.length == 0) {
      return res.status(200).json("Not in Game. Beta video upload success");
    }
    console.log("gameUserStatus");
    console.log(gameUserStatus);
    for (let i = 0; i < gameUserStatus.length; i++) {
      const gameUser = gameUserStatus[i];
      const oneGameId = gameUser.game_id;
      let connection = await getConnection();
      try {
        console.log("begin");
        await beginSQL(connection);
        const allUserOneGame = await lockGameUser(oneGameId, connection);
        let oneUserOneGame = await oneGameUserStatus(
          oneGameId,
          userId,
          connection
        );
        if (oneUserOneGame.is_complete) {
          await commitSQL(connection);
          await releaseConnection(connection);
          continue;
        }
        const game_users_id = oneUserOneGame.game_users_id;

        //update walls
        console.log("start handle update walls");
        let userWalls = await checkGameUserWalls(game_users_id, connection);
        userWalls = userWalls.map((userWall) => userWall.wall_id);

        if (userWalls.indexOf(roomNumericId) === -1) {
          await updateUserWallStatus(game_users_id, roomNumericId, connection);
          await updateUserWallsCount(game_users_id, connection);
        }

        //rank
        console.log("start handle rank");
        let countgGamewalls = await countgGamewallsbyId(oneGameId);
        countgGamewalls = countgGamewalls[0].count_walls;
        oneUserOneGame = await oneGameUserStatus(oneGameId, userId, connection);

        if (oneUserOneGame.complete_walls_count == countgGamewalls) {
          let maxRank = await gameMaxRank(oneGameId, connection);
          maxRank = maxRank.max_rank;
          console.log(maxRank);
          if (maxRank > 0) {
            await updateUserWallsComplete(
              maxRank + 1,
              game_users_id,
              connection
            );
          } else {
            console.log("rank1" + game_users_id);
            await updateUserWallsComplete(1, game_users_id, connection);
          }
        }

        await commitSQL(connection);
        await releaseConnection(connection);
      } catch (err) {
        console.log(err);
        await rollbackSQL(connection); //Server error - rollback
        await releaseConnection(connection);
      }
    }
    res.status(200).json("Beta video upload success");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/detail", async (req, res) => {
  let tagRoomId = req.body.roomId;
  const roomInformation = await getRoom(tagRoomId);
  const wallroomId = roomInformation["wallroomId"];
  const videos = await getVideos(wallroomId);
  res.status(200).json(videos);
});

export default router;
