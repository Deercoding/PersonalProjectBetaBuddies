import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createUser, checkUser } from "../models/user-model.js";
import { signinValidation, signupValidation } from "../utils/dataValidation.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser("signbyAdmin"));
let SaltRounds = 12;

router.post("/signup", async (req, res) => {
  try {
    const { error } = signupValidation(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    let role = "user";
    let { name, email, password } = req.body;
    let userExist = await checkUser(email);
    if (userExist.length != 0) {
      return res.status(403).json("ERROR: 信箱已經註冊");
    }

    // create user
    let pepperPassword = password + process.env.BCRYPT_SECRET;
    let hashPassword = await bcrypt.hash(pepperPassword, SaltRounds);
    console.log(hashPassword);
    let createUserResult = await createUser(name, email, hashPassword, role);
    let userId = createUserResult[0].insertId;

    //jwt token
    const mypayload = {
      userName: name,
      email: email,
      userId: userId,
    };
    const token = jwt.sign(mypayload, process.env.JWT_SECRET, {
      expiresIn: 36000,
    });

    let respond = {
      data: {
        access_token: token,
        access_expired: 36000,
        user: {
          id: userId,
          name: name,
          email: email,
        },
      },
    };

    return res.status(200).json(respond);
  } catch (error) {
    res.status(500).json("Server Error");
    console.error(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { error } = signinValidation(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    //validate email
    let { email, password } = req.body;
    let userExist = await checkUser(email);
    if (userExist.length == 0) {
      return res.status(403).json("ERROR: 信箱或是密碼有誤");
    }

    // // validate password
    let pepperPassword = password + process.env.BCRYPT_SECRET;
    const matchPassword = await bcrypt.compare(
      pepperPassword,
      userExist[0].password
    );

    // //create JWT token
    if (matchPassword) {
      const mypayload = {
        userName: userExist[0].name,
        email: userExist[0].email,
        userId: userExist[0].id,
      };
      const token = jwt.sign(mypayload, process.env.JWT_SECRET, {
        expiresIn: 36000,
      });

      let respond = {
        data: {
          access_token: token,
          access_expired: 36000,
          user: {
            id: userExist[0].id,
            name: userExist[0].name,
            email: userExist[0].email,
          },
        },
      };

      return res.status(200).json(respond);
    }
  } catch (error) {
    res.status(500).json("Server Error");
    console.error(error);
  }
});
export default router;
