import { pool } from "../utils/sqlpool.js";

export async function createGame(
  name,
  short_description,
  long_description,
  date_start,
  date_end,
  member_count,
  game_winners,
  game_award,
  main_image,
  second_image,
  ad_location_id,
  ad_start_date,
  advertise_image
) {
  let result = await pool.query(
    `insert into games(name,short_description,long_description,date_start,date_end,member_count,game_winners,game_award,main_image, second_image,ad_location_id,ad_start_date, advertise_image) values(?,?,?,?,?,?,?,?,?,?,?,?,?);`,
    [
      name,
      short_description,
      long_description,
      date_start,
      date_end,
      member_count,
      game_winners,
      game_award,
      main_image,
      second_image,
      ad_location_id,
      ad_start_date,
      advertise_image,
    ]
  );
  return result;
}
export async function createGameWalls(value) {
  let result = await pool.query(
    `insert into game_walls(game_id,  wallrooms_id) values ${value};`,
    [value]
  );
  return result;
}

export async function createGameUsers(game_id, user_id) {
  let result = await pool.query(
    `insert into game_users(game_id,  user_id) values (?,?);`,
    [game_id, user_id]
  );
  return result;
}

export async function checkAdInfo(ad_location_id) {
  let [rows, fields] = await pool.query(
    `select * from ad_location where ad_location_id = ?;`,
    [ad_location_id]
  );
  return rows[0];
}

export async function updateGamesTableWithWallsId(game_wallrooms_id, game_id) {
  let result = await pool.query(
    `Update games set game_wallrooms_id = ? where game_id = ?;`,
    [game_wallrooms_id, game_id]
  );
  return result;
}
export async function getAdStatus() {
  let [rows, fields] = await pool.query(`select * from ad_status;`);
  return rows;
}

export async function getAdInfo() {
  let [rows, fields] = await pool.query(`select * from ad_location;`);
  return rows;
}

export async function getGameUser(game_id) {
  let [rows, fields] = await pool.query(
    `select * from game_users where game_id = ?;`,
    [game_id]
  );
  return rows;
}

export async function getgamebyId(game_id) {
  let [rows, fields] = await pool.query(
    `select * from games where game_id = ?;`,
    [game_id]
  );
  return rows;
}

export async function checkWallinGame(wallroom_id) {
  let [rows, fields] = await pool.query(
    `select game_id from game_walls where wallrooms_id = ?;`,
    [wallroom_id]
  );
  return rows;
}

export async function checkUserinGame(game_ids) {
  let [rows, fields] = await pool.query(
    `select user_id from game_users where game_id in (?);`,
    [game_ids]
  );
  return rows;
}

export async function getgamewallsbyId(game_id) {
  let [rows, fields] = await pool.query(
    `select * from game_walls where game_id = ?;`,
    [game_id]
  );
  return rows;
}

export async function getUserinGame(game_id, userId) {
  let [rows, fields] = await pool.query(
    `select * from game_users where game_id in (?) and user_id =?;`,
    [game_id, userId]
  );
  return rows;
}

//connection for lock
export async function getConnection() {
  const conn = await pool.getConnection();
  return conn;
}

export async function beginSQL(connection) {
  let result = await connection.query(`begin;`);

  return result;
}

export async function commitSQL(connection) {
  let result = await connection.query(`commit;`);
  return result;
}

export async function rollbackSQL(connection) {
  let result = await connection.query(`rollback;`);
  return result;
}

export async function releaseConnection(connection) {
  let result = await connection.release();
  return result;
}

export async function lockAdLocation(ad_location_id, connection) {
  let [rows, fields] = await connection.query(
    `select * from ad_status where ad_location_id = ? for update;`,
    [ad_location_id]
  );
  return rows;
}

export async function updateAdStatus(
  ad_location_id,
  ad_status,
  game_id,
  start_time,
  end_time,
  connection
) {
  let [rows, fields] = await connection.query(
    `insert into  ad_status (ad_location_id, ad_status, game_id,  start_date, end_date) values (?, ?, ?, ?, ?);`,
    [ad_location_id, ad_status, game_id, start_time, end_time]
  );
  return rows;
}

export async function lockGameUser(game_id, connection) {
  let [rows, fields] = await connection.query(
    `select * from game_users where game_id = ? for update;`,
    [game_id]
  );
  return rows;
}

export async function oneGameUserStatus(game_id, user_id, connection) {
  let [rows, fields] = await connection.query(
    `select * from game_users where game_id = ? and user_id = ?;`,
    [game_id, user_id]
  );
  return rows[0];
}

export async function updateUserWalls(
  complete_walls,
  game_id,
  user_id,
  connection
) {
  let [rows, fields] = await connection.query(
    `update game_users set complete_walls = ? where game_id = ? and user_id = ?;`,
    [complete_walls, game_id, user_id]
  );
  return rows;
}
