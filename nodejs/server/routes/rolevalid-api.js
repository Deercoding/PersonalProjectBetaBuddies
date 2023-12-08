import express from "express";
import jwt from "jsonwebtoken";
import { checkRole } from "../models/user-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", async (req, res) => {
  try {
    const { role_authorization } = req.headers;

    if (!role_authorization) {
      return res.status(401).json("Client Error (No token)");
    }

    let jwtResult;
    const mytoken = role_authorization.split(" ")[1];
    try {
      jwtResult = jwt.verify(mytoken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json("Client Error (Wrong token)");
    }

    let userRole = await checkRole(jwtResult.userId);

    if (userRole[0].role != "admin") {
      return res.status(200).json("user");
    }

    res.status(200).json("admin");
  } catch (err) {
    res.status(500).json("Server Error");
  }
});
export default router;
