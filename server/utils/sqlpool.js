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

const checkConnection = async () => {
  try {
    const [rows, fields] = await pool.query("SELECT 1");
    console.log("MySQL connected");
  } catch (error) {
    console.error("MySQL connection failed: ", error);
  }
};
await checkConnection();

export { pool };
