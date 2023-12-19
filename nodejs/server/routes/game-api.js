import express from "express";
import multer from "multer";
import { uploadObjectGame } from "../utils/awsS3.js";
import {
  createGame,
  createGameWalls,
  getConnection,
  beginSQL,
  commitSQL,
  rollbackSQL,
  releaseConnection,
  lockAdLocation,
  updateAdStatus,
  checkAdInfo,
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
import path from "path";
import url from "url";
import { gameCreateValidation } from "../utils/dataValidation.js";
import Click from "../models/clicks-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    let fileName =
      path.basename(file.originalname) +
      "_" +
      Date.now() +
      path.extname(file.originalname);
    cb(null, fileName);
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
    return fileName;
  },
});

const imageUpload = multer({
  storage: imageStorage,
  async fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }

    cb(undefined, true);
  },
});

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

    //dashboard
    const today = new Date(Date.now());
    let formattedDate = today.toISOString().split("T")[0];

    const findGame = await Click.find({
      date: formattedDate,
      searchId: gameId,
      type: "user_join",
    }).select("-_id clickCount");
    if (findGame.length == 0) {
      const saveClick = new Click({
        searchId: gameId,
        date: formattedDate,
        type: "user_join",
        clickCount: 1,
      });
      await saveClick.save();
    } else {
      await Click.updateOne(
        { date: formattedDate, searchId: gameId, type: "user_join" },
        { $inc: { clickCount: 1 } },
        { new: true }
      );
    }
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
      console.log(error);
      return res.status(400).json(error.details[0].message);
    }

    if (
      !req.files.main_image ||
      !req.files.second_image ||
      !req.files.advertise_image
    ) {
      return res.status(400).json("請上傳挑戰賽照片");
    }

    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const toFolder = __dirname;

    try {
      await uploadObjectGame(
        "videobouldering",
        req.files,
        "ap-southeast-1",
        toFolder
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json("Server Error");
    }

    //lock ad location
    let connection = await getConnection();

    try {
      await beginSQL(connection);
      const checkAdStatus = await lockAdLocation(
        req.body.ad_location_id,
        connection
      );

      // 2. get ad info
      const adLocationInfo = await checkAdInfo(req.body.ad_location_id);
      const adTimeLimit = adLocationInfo.ad_time_limit;
      let adStartDate = new Date(req.body.ad_start_date);
      let adEndDate = new Date(adStartDate);
      adEndDate.setDate(adStartDate.getDate() + Number(adTimeLimit));

      //change input to UTC
      function dateToUtc(localDate) {
        const utcDate = new Date(
          localDate.getUTCFullYear(),
          localDate.getUTCMonth(),
          localDate.getUTCDate(),
          localDate.getUTCHours(),
          localDate.getUTCMinutes(),
          localDate.getUTCSeconds()
        );
        return utcDate;
      }
      adEndDate = dateToUtc(adEndDate);
      adStartDate = dateToUtc(adStartDate);

      // 3. check overlap
      let hasOverlap = false;
      for (let i = 0; i < checkAdStatus.length; i++) {
        const oldAd = checkAdStatus[i];
        const oldAdStart = new Date(oldAd.start_date);
        const oldAdEnd = new Date(oldAd.end_date);
        const noOverlapCondition =
          adEndDate <= oldAdStart || adStartDate >= oldAdEnd;
        if (!noOverlapCondition) {
          hasOverlap = true;
          break;
        }
      }
      if (hasOverlap) {
        console.log("Ad location already in use.");
        await rollbackSQL(connection); //Server error - rollback
        await releaseConnection(connection);
        return res.status(400).json("廣告日期已被預訂");
      }

      // create game
      let dateStart = new Date(req.body.date_start);
      let dateEnd = new Date(req.body.date_end);
      dateStart = dateToUtc(dateStart);
      dateEnd = dateToUtc(dateEnd);

      let result = await createGame(
        req.body.name,
        req.body.short_description,
        req.body.long_description,
        dateStart,
        dateEnd,
        req.body.game_winners,
        req.body.game_award,
        req.files["main_image"][0].filename,
        req.files["second_image"][0].filename,
        req.body.ad_location_id,
        adStartDate,
        req.files["advertise_image"][0].filename,
        req.body.creator
      );

      // 4. save ad location
      await updateAdStatus(
        req.body.ad_location_id,
        true,
        result[0].insertId,
        adStartDate,
        adEndDate,
        req.files["advertise_image"][0].filename,
        connection
      );

      await commitSQL(connection);
      await releaseConnection(connection);

      // 5. create walls table
      const rooms_id = req.body.game_wallrooms_id.split(",");
      const game_id = result[0].insertId;
      let wallroomIdforSQl = rooms_id.map((wallroom) => {
        return `(${game_id},'${wallroom}')`;
      });
      wallroomIdforSQl = wallroomIdforSQl.join(",");
      await createGameWalls(wallroomIdforSQl);

      res.status(200).json("Upload game success");
    } catch (err) {
      await rollbackSQL(connection); //Server error - rollback
      await releaseConnection(connection);
      console.log(err);
      res.status(500).json("Server Error");
    }
  }
);

export default router;
