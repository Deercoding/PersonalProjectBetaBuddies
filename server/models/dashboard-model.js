import { pool } from "../utils/sqlpool.js";

export async function getGameDashboard(creator) {
  let [rows, fields] = await pool.query(
    `select games.game_id, name, date_start, date_end, ad_start_date, games.ad_location_id, ad_location, ad_time_limit, ad_status.ad_status_id from games left join ad_location on games.ad_location_id = ad_location.ad_location_id left join ad_status on games.game_id = ad_status.game_id where creator = ?;`,
    [creator]
  );
  return rows;
}

export async function getCompleteUsers(game_id) {
  let [rows, fields] = await pool.query(
    `select count(user_id) as total_users, is_complete from game_users  where game_id =? group by is_complete;`,
    [game_id]
  );
  return rows;
}

export async function getCompleteWalls(game_id) {
  let [rows, fields] = await pool.query(
    `select sum(complete_walls_count) as total_complete_walls from game_users  where game_id =?;`,
    [game_id]
  );
  return rows;
}
