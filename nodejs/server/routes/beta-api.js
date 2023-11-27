import express, { response } from "express";
import multer from "multer";
import path from "path";
import url from "url";
import { uploadVideo } from "../utils/awsS3.js";
import { getRoom } from "../models/wallroom-model.js";
import TagRoom from "../models/tagroom-model.js";
import { createVideo, getVideos } from "../models/video-model.js";

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
      userName
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

    res.status(200).json("Beta video upload success");
  } catch (err) {
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
