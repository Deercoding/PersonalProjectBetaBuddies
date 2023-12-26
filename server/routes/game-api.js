import { uploadObjectGame } from "../utils/awsS3.js";
import {
  createGameWalls,
  getConnection,
  getAdStatus,
  getAdInfo,
  getgamebyId,
  getgamewallsbyId,
  createGameUsers,
  getGameUser,
  getGames,
  checkUserinGame,
} from "../models/game-model.js";
import { getRoombySearch } from "../models/wallroom-model.js";
import { gameCreateValidation } from "../utils/dataValidation.js";
import { countUserJoinClick } from "../controller/dashboard.js";
import { routerSetup, dirnameSetup } from "../middleware/routerSetup.js";
import { imageUpload } from "../middleware/multer.js";
import { createGameandAdvertisement } from "../controller/gameLogic.js";

const router = routerSetup();
const { __dirname } = dirnameSetup();

router.get("/adlocation", async (req, res) => {
  try {
    const adLocationInfo = await getAdInfo();
    const adstatus = await getAdStatus();
    const adUsed = adstatus.map((ad) => {
      return {
        ad_location_id: ad.ad_location_id,
        start_date: ad.start_date,
        end_date: ad.end_date,
        ad_status_id: ad.ad_status_id,
      };
    });
    const responses = {
      adLocationInfo: adLocationInfo,
      adStatus: adUsed,
    };
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.post("/user", async (req, res) => {
  let { gameId, userId } = req.body;
  try {
    if (!userId) {
      return res.status(401).json("請登入後再參加挑戰賽");
    }
    userId = userId.split(",")[0];
    let userIds = await checkUserinGame(gameId);
    userIds = userIds.map((userId) => userId.user_id);
    if (userIds.includes(Number(userId))) {
      return res.status(400).json("使用者已經加入挑戰賽, 請查看底下挑戰賽排名");
    }
    await createGameUsers(gameId, userId);
    res.status(200).json("Success create user!");

    await countUserJoinClick(gameId);
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

router.get("/user", async (req, res) => {
  try {
    let { gameId } = req.query;
    const result = await getGameUser(gameId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.get("/list", async (req, res) => {
  try {
    const gameList = await getGames();
    res.status(200).json(gameList);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.get("/detail", async (req, res) => {
  try {
    if (!req.query.gameId) {
      return res.status(400).json("Please provide game id");
    }

    const gameId = req.query.gameId;
    const gameInfo = await getgamebyId(gameId);
    if (gameInfo.length == 0) {
      return res.status(400).json("Game does not exist");
    }
    const gameWalls = await getgamewallsbyId(gameId);
    if (gameWalls.length == 0) {
      return res.status(400).json("Game does not exist");
    }

    let wallroomsId = gameWalls.map((gameWall) => {
      return `"${gameWall.wallrooms_id}"`;
    });
    wallroomsId = wallroomsId.join(",");
    const wallroomInfo = await getRoombySearch(
      `tag_room_id in (${wallroomsId});`
    );
    const responses = {
      gameInfo: gameInfo,
      wallroomInfo: wallroomInfo,
    };
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json("Server Error");
  }
});

router.post(
  "/detail",
  imageUpload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "second_image", maxCount: 1 },
    { name: "advertise_image", maxCount: 1 },
  ]),
  async (req, res) => {
    const { error } = gameCreateValidation(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    if (
      !req.files.main_image ||
      !req.files.second_image ||
      !req.files.advertise_image
    ) {
      return res.status(400).json("請上傳挑戰賽照片");
    }

    const connection = await getConnection();
    const createGameandAdResult = await createGameandAdvertisement(
      req.body,
      req.files,
      connection
    );

    if (createGameandAdResult == "廣告日期已被預訂") {
      return res.status(400).json(createGameandAdResult);
    } else if (createGameandAdResult == "Server Error") {
      return res.status(500).json(createGameandAdResult);
    }
    const newGameId = createGameandAdResult;

    try {
      const rooms_id = req.body.game_wallrooms_id.split(",");
      let wallroomIdforSQl = rooms_id.map((wallroom) => {
        return `(${newGameId},'${wallroom}')`;
      });
      wallroomIdforSQl = wallroomIdforSQl.join(",");
      await createGameWalls(wallroomIdforSQl);

      const toFolder = __dirname;
      await uploadObjectGame(
        "videobouldering",
        req.files,
        "ap-southeast-1",
        toFolder
      );
    } catch (err) {
      return res.status(500).json("Server Error");
    }

    res.status(200).json("Upload game success");
  }
);

export default router;
