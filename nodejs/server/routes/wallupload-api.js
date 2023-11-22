import express from "express";
import multer from "multer";
import path from "path";
import url from "url";
import { uploadObject } from "../utils/awsS3.js";

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

const imageUpload = multer({
  storage: imageStorage,
  async fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

router.post("/", imageUpload.array("file", 12), async (req, res) => {
  let toFolder = __dirname;
  uploadObject("boulderingproject", req.files, "ap-southeast-1", toFolder);
});

router.post("/response", async (req, res) => {
  const imageNames = req.body;
  const io = req.app.get("socketio");
  io.emit("wallcolor", imageNames.imageNames);
  console.log("Get image result");
});

export default router;
