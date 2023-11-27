import express from "express";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  console.log("game routes ");
  res.status(200).json();
});

export default router;
