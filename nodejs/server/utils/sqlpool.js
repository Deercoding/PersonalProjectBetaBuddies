// Package Install
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import mysql from "mysql2";

// const pool = mysql
//   .createPool({
//     host: "",
//     user: "admin",
//     database: "stylish",
//     password: process.env.RDS_SQLPASSWORD,
//   })
//   .promise();

const pool = mysql
  .createPool({
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    database: "bouldering",
    password: process.env.SQLPASSWORD,
  })
  .promise();

// export async function checkConnection() {
//   let [rows, fields] = await pool.query(`select * from product;`);
//   return rows;
// }
// console.log(await checkConnection());

export { pool };
