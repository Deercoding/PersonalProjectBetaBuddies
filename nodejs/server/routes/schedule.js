import express from "express";
import { getAdLocationId, checkAdBetweenDate } from "../models/ad-model.js";
import { redisClient } from "../utils/cache.js";
import {
  updateGameStatus,
  updateGameStatusFuture,
} from "../models/game-model.js";
import { searchKeyword } from "../utils/elastic-func.js";
import client from "../utils/elastic-client.js";

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

router.get("/test", async (req, res) => {
  const testIndex = "6566b2f2b119df255098b304";
  const body = await client.indices.getMapping({
    index: testIndex,
  });
  console.log(body[testIndex].mappings.properties.content);
  const bodySearch = await client.search({ index: "6566b2f2b119df255098b304" });
  console.log(bodySearch.hits.hits);

  const bodyAnalyze = await client.indices.analyze({
    analyzer: "ik_max_word",
    index: testIndex,
    text: "核心力量蠻重要的,fall 了好幾次, 超可怕",
  });
  console.log(bodyAnalyze);
});

export default router;
