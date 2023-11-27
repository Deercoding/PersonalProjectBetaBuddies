import { pool } from "../utils/sqlpool.js";

export async function createUser(name, email, password, role) {
  let result = await pool.query(
    `insert into users(name, email, password, role) values(?,?,?,?);`,
    [name, email, password, role]
  );
  return result;
}

export async function checkUser(email) {
  let [rows, fields] = await pool.query(
    `select * from users where email = ?;`,
    [email]
  );
  return rows;
}
