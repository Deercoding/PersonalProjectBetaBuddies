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
  updateUserWalls,
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
    // let uploadVideoResult = uploadVideo(
    //   "videobouldering",
    //   req.file,
    //   videoSaveName,
    //   "ap-southeast-1",
    //   toFolder
    // );

    const roomInformation = await getRoom(roomNumericId);
    const wallroomId = roomInformation["wallroomId"];

    // await createVideo(
    //   wallroomId,
    //   process.env.VIDEOS3_CDN + videoSaveName,
    //   comments,
    //   levelByAuthor,
    //   userId,
    //   userName,
    //   roomNumericId
    // );

    // for (let i = 0; i < tags.length; i++) {
    //   const conditions = {
    //     roomNumericId: roomNumericId,
    //     tag: tags[i],
    //   };

    //   let roomTagPair = await TagRoom.find(conditions);

    //   if (roomTagPair.length > 0) {
    //     const update = { $inc: { tagCount: 1 } };
    //     await TagRoom.findOneAndUpdate(conditions, update, { upsert: true });
    //   } else {
    //     const saveTag = new TagRoom({
    //       roomNumericId: roomNumericId,
    //       tag: tags[i],
    //       tagCount: 1,
    //     });
    //     await saveTag.save();
    //   }
    // }

    //check game logic
    let gameIds = await checkWallinGame(roomNumericId);
    gameIds = gameIds.map((gameId) => gameId.game_id);
    if (gameIds.length == 0) {
      return res.status(200).json("Not in Game. Beta video upload success");
    }

    const gameUserStatus = await getUserinGame(gameIds, userId);
    if (gameUserStatus.length == 0) {
      return res.status(200).json("Not in Game. Beta video upload success");
    }

    // [
    //   {
    //     game_users_id: 19,
    //     game_id: 52,
    //     user_id: 2,
    //     user_rank: 9999,
    //     complete_status: 0,
    //     is_complete: 0
    //   },
    //   {
    //     game_users_id: 20,
    //     game_id: 51,
    //     user_id: 2,
    //     user_rank: 9999,
    //     complete_status: 0,
    //     is_complete: 0
    //   }
    // ]
    //user and wall is in multiple games
    for (let i = 0; i < gameUserStatus.length; i++) {
      const gameUser = gameUserStatus[i];
      const oneGameId = gameUser.game_id;
      let connection = await getConnection();
      try {
        // await beginSQL(connection);
        const allUserOneGame = await lockGameUser(oneGameId, connection);
        const oneUserOneGame = await oneGameUserStatus(
          oneGameId,
          userId,
          connection
        );
        if (oneUserOneGame.isComplete) {
          continue;
        }
        // logic- video already on wall
        //await updateUserWalls("[]", oneGameId, userId, connection);
        console.log(oneUserOneGame);
        console.log(oneUserOneGame.complete_walls);
        console.log(JSON.parse(oneUserOneGame.complete_walls));

        // 處理 [] 中
        //rank
        // await commitSQL(connection);
        // await releaseConnection(connection);
      } catch (err) {
        console.log(err);
      }
    }

    // --- lock game_users where game_id  = ?
    // user's video on the walls, count how many beta, update game_users

    res.status(200).json("Beta video upload success");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post("/detail", async (req, res) => {
  let tagRoomId = req.body.tagRoomId;
  const roomInformation = await getRoom(tagRoomId);
  const wallroomId = roomInformation["wallroomId"];
  const videos = await getVideos(wallroomId);
  res.status(200).json(videos);
});

export default router;
