import multer from "multer";
import { uploadVideoS3 } from "../utils/awsS3.js";
import { getRoomId } from "../models/wallroom-model.js";
import TagRoom from "../models/tagroom-model.js";
import { createVideo, getVideos } from "../models/video-model.js";
import { betaCreateValidation } from "../utils/dataValidation.js";
import { updateGameRank } from "../controller/gameLogic.js";
import { routerSetup, dirnameSetup } from "../middleware/routerSetup.js";

const router = routerSetup();
const { __filename, __dirname } = dirnameSetup();
const upload = multer({ dest: "public/videos/" });

router.post("/", upload.single("video"), async (req, res) => {
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
    await uploadVideoS3(
      "videobouldering",
      req.file,
      videoSaveName,
      "ap-southeast-1",
      toFolder
    );

    const today = new Date();
    const roomInformation = await getRoomId(roomNumericId, today);
    const wallroomId = roomInformation.wallroomId;

    await createVideo(
      wallroomId,
      process.env.VIDEOS3_CDN + videoSaveName,
      comments,
      levelByAuthor,
      userId,
      userName,
      roomNumericId
    );

    const bulkOperations = tags.map((tag) => ({
      updateOne: {
        filter: { roomNumericId: roomNumericId, tag: tag },
        update: { $inc: { tagCount: 1 } },
        upsert: true,
      },
    }));
    await TagRoom.bulkWrite(bulkOperations);

    const gameResult = await updateGameRank(roomNumericId, userId);

    if (gameResult == "Game logic upload fail") {
      res.status(500).json("Beta upload sucess. Game logic upload fail.");
    } else {
      res.status(200).json(gameResult);
    }
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
