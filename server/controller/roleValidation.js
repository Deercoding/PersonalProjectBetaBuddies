import jwt from "jsonwebtoken";
import { checkRole } from "../models/user-model.js";

export async function roleValidation(headers) {
  try {
    const { authorization } = headers;

    if (!authorization) {
      return "Client Error (No token)";
    }

    let jwtResult;
    const mytoken = authorization.split(" ")[1];
    try {
      jwtResult = jwt.verify(mytoken, process.env.JWT_SECRET);
    } catch (err) {
      return "Client Error (Wrong token)";
    }

    let userRole = await checkRole(jwtResult.userId);

    if (userRole[0].role != "admin") {
      return "user";
    }
    return "admin";
  } catch (err) {
    res.status(500).json("Server Error");
  }
}
