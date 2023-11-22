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
  console.log(req.files);

  // save to DB - save later
  // let imageSend = [];
  // let imageQuery = [];
  // for (let i = 1; i < req.files.length; i++) {
  //   let imageName = req.files[i].filename;
  //   imageSend.push(imageName);
  //   imageQuery.push([product_id, imageName]);
  // }
  // await createImage(imageQuery);
  let toFolder = __dirname;
  uploadObject("boulderingproject", req.files, "ap-southeast-1", toFolder);
});

router.post("/response", async (req, res) => {
  const imageNames = req.body;
  // const cloudfrontUrl = "https://d3ebcb0pef2qqe.cloudfront.net/";
  // const cdnTest = cloudfrontUrl + imageNames.image_name[0];
  const io = req.app.get("socketio");
  io.emit("wallcolor", imageNames.image_name);
  console.log("Get image result");
});

export default router;
