import express from "express";
import jwt from "jsonwebtoken";
import { checkRole } from "../models/user-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(403).json("Client Error (No token) ");
  }

  let jwtResult;
  try {
    const mytoken = req.headers.authorization.split(" ")[1];
    jwtResult = jwt.verify(mytoken, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json("Client Error (Wrong token)");
  }

  let userRole;
  try {
    userRole = await checkRole(jwtResult.userId);
  } catch (err) {
    return res.status(403).json("User role Error");
  }

  if (userRole[0].role != "admin") {
    console.log("user");
    return res.status(200).json("user");
  }
  console.log("admin");

  res.status(200).json("admin");
});
export default router;
