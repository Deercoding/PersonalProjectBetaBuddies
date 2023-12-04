import { pool } from "../utils/sqlpool.js";

export async function checkAdStatus(ad_location_id) {
  let [rows, fields] = await pool.query(
    `select * from ad_status where ad_location_id = ?;`,
    [ad_location_id]
  );
  return rows;
}

export async function checkAdBetweenDate(ad_location_id, today) {
  let [rows, fields] = await pool.query(
    `select ad_location_id, ad_image, game_id from ad_status where ad_location_id=? and start_date<= ? and end_date > ?`,
    [ad_location_id, today, today]
  );
  return rows;
}

export async function getAdLocationId() {
  let [rows, fields] = await pool.query(
    `select ad_location_id from ad_location;`
  );
  return rows;
}
