import express from "express";
import { getAdLocationId, checkAdBetweenDate } from "../models/ad-model.js";
import { redisClient } from "../utils/cache.js";
import {
  updateGameStatus,
  updateGameStatusFuture,
} from "../models/game-model.js";
import { searchKeyword } from "../utils/elastic-func.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  try {
    // schedule ad status
    const ad_location = await getAdLocationId();
    for (let i = 0; i < ad_location.length; i++) {
      let ad_location_id = ad_location[i].ad_location_id;
      let today = new Date(Date.now()); //UTC
      let checkAdValid = await checkAdBetweenDate(ad_location_id, today);
      const redisDefualtExpriation = 60 * 60 * 24 * 7; //7 days
      if (checkAdValid.length > 0) {
        redisClient.setEx(
          "ad_location_id_" + ad_location_id,
          redisDefualtExpriation,
          JSON.stringify(checkAdValid)
        );
      }
    }
    // update game status
    const today = new Date(Date.now());
    await updateGameStatus(today);
    await updateGameStatusFuture(today);

    // search keyword
    await searchKeyword();

    res.status(200).json("Daily schedule success.");
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
