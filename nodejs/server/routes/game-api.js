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
  updateGamesTableWithWallsId,
  getAdStatus,
  getAdInfo,
  getgamebyId,
  getgamewallsbyId,
  createGameUsers,
  getGameUser,
} from "../models/game-model.js";
import { getRoombySearch } from "../models/wallroom-model.js";
import path from "path";
import url from "url";

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
});

router.post("/user", async (req, res) => {
  const { gameId, userId } = req.body;
  try {
    //if user not in game alread -> add in logic
    await createGameUsers(gameId, userId);
    res.status(200).json("Success create user!");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/user", async (req, res) => {
  let { gameId } = req.query;
  const result = await getGameUser(gameId);
  res.status(200).json(result);
});

router.get("/list", async (req, res) => {});

router.get("/detail", async (req, res) => {
  const gameId = "51";
  const gameInfo = await getgamebyId(gameId);
  const gameWalls = await getgamewallsbyId(gameId);
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
});

router.post(
  "/detail",
  imageUpload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "second_image", maxCount: 3 },
    { name: "advertise_image", maxCount: 1 },
  ]),
  async (req, res) => {
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const toFolder = __dirname;
    //save to DB
    await uploadObjectGame(
      "videobouldering",
      req.files,
      "ap-southeast-1",
      toFolder
    );

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
      adEndDate = new Date(
        adEndDate.getUTCFullYear(),
        adEndDate.getUTCMonth(),
        adEndDate.getUTCDate(),
        0,
        0,
        0,
        0
      );
      adStartDate = new Date(
        adStartDate.getUTCFullYear(),
        adStartDate.getUTCMonth(),
        adStartDate.getUTCDate(),
        0,
        0,
        0,
        0
      );

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
        console.log("Ad location already in use");
        await rollbackSQL(connection); //Server error - rollback
        await releaseConnection(connection);
        return res.status(400).json("Ad location already in use");
      }

      // create game
      let result = await createGame(
        req.body.name,
        req.body.short_description,
        req.body.long_description,
        new Date(req.body.date_start),
        new Date(req.body.date_end),
        req.body.member_count,
        req.body.game_winners,
        req.body.game_award,
        req.files["main_image"][0].filename,
        req.files["second_image"][0].filename,
        req.body.ad_location_id,
        req.body.ad_start_date,
        req.files["advertise_image"][0].filename
      );

      // 4. save ad location
      await updateAdStatus(
        req.body.ad_location_id,
        true,
        result[0].insertId,
        adStartDate,
        adEndDate,
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
      const wallsResult = await createGameWalls(wallroomIdforSQl);

      // 6. add walls to games - not used
      // const wallsId = wallsResult[0].insertId;
      // await updateGamesTableWithWallsId(wallsId, game_id);

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
