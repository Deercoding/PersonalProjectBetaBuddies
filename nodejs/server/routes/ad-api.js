import express from "express";
import { checkAdBetweenDate } from "../models/ad-model.js";
import { redisClient } from "../utils/cache.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  let ad_location_id = req.query.ad_location_id;
  const redisDefualtExpriation = 60 * 60 * 24 * 7;
  let adResult;

  if (!redisClient.isReady) {
    console.log("redis not connected");
    let today = new Date(Date.now()); //UTC
    adResult = await checkAdBetweenDate(ad_location_id, today);
    await redisClient.connect();
    return res.status(200).json(adResult);
  }

  adResult = await redisClient.get("ad_location_id_" + ad_location_id);

  if (!adResult) {
    console.log("No cache");
    let today = new Date(Date.now()); //UTC
    adResult = await checkAdBetweenDate(ad_location_id, today);
    if (adResult.length > 0) {
      redisClient.setEx(
        "ad_location_id_" + ad_location_id,
        redisDefualtExpriation,
        JSON.stringify(adResult)
      );
    }
    return res.status(200).json(adResult);
  }

  res.status(200).json(JSON.parse(adResult));

  // render information on component
  // if user click ad - ad location click + 1
  // update ad_location
});

export default router;
