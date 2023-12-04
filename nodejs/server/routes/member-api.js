import express from "express";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/user", async (req, res) => {
  res.status(200).json("This is user member page");
});

router.post("/admin", async (req, res) => {
  res.status(200).json("This is admin member page");
});

export default router;
