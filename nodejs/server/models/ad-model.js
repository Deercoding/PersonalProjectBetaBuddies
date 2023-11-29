import { pool } from "../utils/sqlpool.js";

export async function checkAdStatus(ad_location_id) {
  let [rows, fields] = await pool.query(
    `select * from ad_status where ad_location_id = ?;`,
    [ad_location_id]
  );
  return rows[0];
}
