import express, { json } from "express";
import multer from "multer";
import path from "path";
import url from "url";
import fs from "fs";
import { uploadObject } from "../utils/awsS3.js";
import crypto from "node:crypto";
import { redisClient } from "../utils/cache.js";

let globalImageHash = "";

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
});

router.post("/", imageUpload.array("file", 12), async (req, res) => {
  if (req.files.length == 0) {
    return res.status(400).json("請上傳圖片再送出");
  }

  const data = fs.readFileSync(
    path.resolve(__dirname, "..//public//images//", req.files[0].filename)
  );
  globalImageHash = crypto.createHash("sha256").update(data).digest("hex");

  if (redisClient.isReady) {
    const duplicateImage = await redisClient.hGet(
      "image_hashes",
      globalImageHash
    );
    if (duplicateImage) {
      res.redirect("https://deercodeweb.com/walladdtag");
      //http://localhost:3000/walladdtag

      let sentBody = { oldImageNames: JSON.parse(duplicateImage) };

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await fetch("/api/wallupload/response", {
        //http://localhost:8080/api/wallupload/response
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sentBody),
      });
    }
  } else {
    try {
      let toFolder = __dirname;
      await uploadObject(
        "boulderingproject",
        req.files,
        "ap-southeast-1",
        toFolder
      );
      res.redirect("http://localhost:3000/walladdtag");
      await redisClient.connect();
    } catch (err) {
      res.status(500).json("Error: 請重新上傳照片");
    }
  }
});

router.post("/response", async (req, res) => {
  try {
    const imageNames = req.body;
    const io = req.app.get("socketio");

    if (imageNames.oldImageNames) {
      io.emit("wallcolor", imageNames.oldImageNames);
      console.log("Get color detection image result");
      return res.status(200).send("Color detection success.");
    } else {
      io.emit("wallcolor", imageNames.imageNames);

      if (redisClient.isReady && globalImageHash) {
        console.log(globalImageHash);
        redisClient.hSet(
          "image_hashes",
          globalImageHash,
          JSON.stringify(imageNames.imageNames)
        );
      } else {
        await redisClient.connect();
      }
      console.log("Get color detection image result");
      return res.status(200).send("Color detection success.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
