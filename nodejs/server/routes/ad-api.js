import express from "express";
import { checkAdStatus } from "../models/ad-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
  const ad_location_id = 1;
  let result = await checkAdStatus(ad_location_id);
  //manage UTC time
  let today = new Date();
  console.log(today);
  const todayUTC = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    0,
    0,
    0,
    0
  );

  // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log(today.getTimezoneOffset()); // -60
  // const currentDate = new Date();
  // const isoString = currentDate.toISOString();
  // console.log(isoString);
  res.status(200).json(result);
});

export default router;
