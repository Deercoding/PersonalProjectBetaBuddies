import express from "express";
import { checkAdBetweenDate } from "../models/ad-model.js";
import { redisClient } from "../utils/cache.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  try {
    const { ad_location_id } = req.query;
    const redisDefualtExpiration = 60 * 60 * 24 * 1;
    const defaultAd = "game-main-image.jpg_1701348260614.jpg";
    let adResult;

    if (!redisClient.isReady) {
      console.log("redis not connected");
      let today = new Date(Date.now()); //UTC
      adResult = await checkAdBetweenDate(ad_location_id, today);

      if (adResult.length == 0) {
        return res.status(200).json([
          {
            ad_location_id: ad_location_id,
            ad_image: defaultAd,
          },
        ]);
      }
      await redisClient.connect();
      return res.status(200).json(adResult);
    }

    adResult = await redisClient.get("ad_location_id_" + ad_location_id);

    if (!adResult) {
      let today = new Date();
      adResult = await checkAdBetweenDate(ad_location_id, today);
      if (adResult.length > 0) {
        redisClient.setEx(
          "ad_location_id_" + ad_location_id,
          redisDefualtExpiration,
          JSON.stringify(adResult)
        );
        return res.status(200).json(adResult);
      } else {
        return res.status(200).json([
          {
            ad_location_id: ad_location_id,
            ad_image: defaultAd,
          },
        ]);
      }
    }
    if (adResult.length == 0) {
      return res.status(200).json([
        {
          ad_location_id: ad_location_id,
          ad_image: defaultAd,
        },
      ]);
    }
    res.status(200).json(JSON.parse(adResult));
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default router;
