import path from "path";
import fs from "fs";
import { uploadObject } from "../utils/awsS3.js";
import crypto from "node:crypto";
import { redisClient } from "../utils/cache.js";

export async function wallUpload(files) {
  try {
    if (files.length == 0) {
      return "請上傳圖片再送出";
    }
    const data = fs.readFileSync(
      path.resolve(__dirname, "..//public//images//", files[0].filename)
    );
    const globalImageHash = crypto
      .createHash("sha256")
      .update(data)
      .digest("hex");

    const duplicateImage = await redisClient.hGet(
      "image_hashes",
      globalImageHash
    );

    if (redisClient.isReady && duplicateImage) {
      //   res.redirect("https://deercodeweb.com/walladdtag");

      let sentBody = { oldImageNames: JSON.parse(duplicateImage) };
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await fetch("http://localhost:8080/api/wallupload/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sentBody),
      });

      return "Reply old image with color detection";
    } else {
      let toFolder = __dirname;
      await uploadObject(
        "boulderingproject",
        req.files,
        "ap-southeast-1",
        toFolder
      );
      res.redirect("https://deercodeweb.com/walladdtag");
    }
    return "Send image to S3";
  } catch (err) {
    console.log(err);
    return "Server Error";
  }
}
