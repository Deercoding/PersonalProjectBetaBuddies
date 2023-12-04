import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createUser, checkUser } from "../models/user-model.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser("signbyAdmin"));
let SaltRounds = 12;

router.post("/signup", async (req, res) => {
  try {
    //check JSON
    //check user input
    //check email

    let role = "user";
    let { name, email, password } = req.body;
    let userExist = await checkUser(email);
    if (userExist.length != 0) {
      return res.status(403).json("Email Error: Email Already Exists.");
    }

    // create user
    let pepperPassword = password + process.env.BCRYPT_SECRET;
    let hashPassword = await bcrypt.hash(pepperPassword, SaltRounds);
    let createUserResult = await createUser(name, email, hashPassword, role);
    let userId = createUserResult[0].insertId;
    console.log(createUserResult);

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
    res.status(500).json("Server Error:" + error.message);
    console.error(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    //check JSON
    //check form input

    //validate email
    let { email, password } = req.body;
    let userExist = await checkUser(email);
    if (userExist.length == 0) {
      return res
        .status(403)
        .json("Sign In Failed: Email or password incorrect.");
    }

    // // validate password
    let pepperPassword = password + process.env.BCRYPT_SECRET;
    const matchPassword = await bcrypt.compare(
      pepperPassword,
      userExist[0].password
    );
    console.log(matchPassword);
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
    res.status(500).json("Server Error:" + error.message);
    console.error(error);
  }
});
export default router;
