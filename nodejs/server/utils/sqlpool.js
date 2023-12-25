import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    database: "bouldering",
    password: process.env.SQLPASSWORD,
    multipleStatements: true,
  })
  .promise();

export { pool };
