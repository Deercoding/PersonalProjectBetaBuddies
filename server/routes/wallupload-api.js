import path from "path";
import fs from "fs";
import crypto from "node:crypto";
import { routerSetup, dirnameSetup } from "../middleware/routerSetup.js";
import { imageUpload } from "../middleware/multer.js";
import { redisClient } from "../utils/cache.js";
import { uploadObject } from "../utils/awsS3.js";

const router = routerSetup();
const { __dirname } = dirnameSetup();

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
    io.emit("wallcolor", imageNames);

    if (redisClient.isReady) {
      const globalImageHash = await redisClient.getDel("hash_image_name");
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
