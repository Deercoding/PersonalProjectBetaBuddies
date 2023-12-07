import express from "express";
import { getAdLocationId, checkAdBetweenDate } from "../models/ad-model.js";
import { redisClient } from "../utils/cache.js";
import {
  updateGameStatus,
  updateGameStatusFuture,
  updatePastGameStatus,
} from "../models/game-model.js";
import {
  searchKeyword,
  createAutocompleteIndex,
  addDocumentinAutocomplete,
  searchDocuments,
} from "../utils/elastic-func.js";
import client from "../utils/elastic-client.js";
import path from "path";
import url from "url";
import fs from "fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    await updatePastGameStatus(today);

    // search keyword
    await searchKeyword();

    res.status(200).json("Daily schedule success.");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/elastic", async (req, res) => {
  let myindex = "autocomplete-tagsearch-12030744";

  await createAutocompleteIndex(client, myindex);

  let dataset = fs
    .readFileSync(path.join(__dirname, "../utils/boulderingTerms.txt"))
    .toString()
    .split("\n");
  dataset = dataset.map((item) => item.replace(/\r/g, ""));
  const datasetArray = [];

  for (const line of dataset) {
    if (line.trim() === "") {
      continue;
    }
    const obj = { text: line.trim() };
    datasetArray.push(obj);
  }

  await addDocumentinAutocomplete(client, datasetArray, myindex);

  const autosearch = await searchDocuments(client, myindex, "指");
  console.log(autosearch);

  // test ik analyzer
  let iktest = await client.indices.analyze({
    body: {
      analyzer: "ik_max_word",
      text: "dyno在後面倒掛起攀完攀!",
    },
  });
  console.log(iktest);

  res.send("initial elastic index success");
});

export default router;
