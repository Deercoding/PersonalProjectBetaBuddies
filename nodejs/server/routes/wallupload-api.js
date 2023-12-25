import express, { json } from "express";
import multer from "multer";
import path from "path";
import url from "url";
import fs from "fs";
import { uploadObject } from "../utils/awsS3.js";
import crypto from "node:crypto";
import { redisClient } from "../utils/cache.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageStorage = multer.diskStorage({
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
    return fileName;
  },
});

async function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
    return cb("ERROR:請上傳圖片檔(png|jpg|jpeg)", false);
  }
  cb(undefined, true);
}

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

router.post("/", imageUpload.array("file", 12), async (req, res) => {
  try {
    if (req.files.length == 0) {
      return res.status(400).json("請上傳圖片再送出");
    }
    const data = fs.readFileSync(
      path.resolve(
        path.join(__dirname, "../public/images"),
        req.files[0].filename
      )
    );
    const imageHash = crypto.createHash("sha256").update(data).digest("hex");

    let duplicateImage;
    if (redisClient.isReady) {
      duplicateImage = await redisClient.hGet("image_hashes", imageHash);

      if (duplicateImage) {
        res.redirect("https://deercodeweb.com/walladdtag");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const io = req.app.get("socketio");
        io.emit("wallcolor", JSON.parse(duplicateImage));
      } else {
        let toFolder = __dirname;
        await uploadObject(
          "boulderingproject",
          req.files,
          "ap-southeast-1",
          toFolder
        );
        await redisClient.set("hash_image_name", imageHash, {
          EX: 120,
          NX: true,
        });

        res.redirect("https://deercodeweb.com/walladdtag");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/response", async (req, res) => {
  try {
    const { imageNames } = req.body;
    const io = req.app.get("socketio");
    console.log(imageNames);
    io.emit("wallcolor", imageNames);

    if (redisClient.isReady) {
      const globalImageHash = await redisClient.getDel("hash_image_name");
      console.log(globalImageHash);

      await redisClient.hSet(
        "image_hashes",
        globalImageHash,
        JSON.stringify(imageNames)
      );
    }

    return res.status(200).send("Color detection success.");
  } catch (err) {
    console.log(err);
  }
});

export default router;
