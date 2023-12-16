import { pool } from "../utils/sqlpool.js";

export async function createRoom(
  wallimage,
  official_level,
  gym_id,
  wall,
  color,
  tag_room_id,
  wall_update_time,
  wall_change_time,
  creator
) {
  let result = await pool.query(
    `insert into wallrooms(wallimage,official_level,gym_id,wall,color,tag_room_id, wall_update_time, wall_change_time, creator) values(?,?,?,?,?,?,?,?,?)`,
    [
      wallimage,
      official_level,
      gym_id,
      wall,
      color,
      tag_room_id,
      wall_update_time,
      wall_change_time,
      creator,
    ]
  );
}

export async function saveWallOriginal(wallimage_original, gym_id, wall) {
  let result = await pool.query(
    `insert into walls(wallimage_original,gym_id,wall) values(?,?,?)`,
    [wallimage_original, gym_id, wall]
  );
}

export async function getWallOriginal(gym_id) {
  let [rows, fields] = await pool.query(
    `select walls.wallimage_original, walls.gym_id, walls.wall, wallrooms.wall_update_time, wallrooms.wall_change_time from walls left join wallrooms on walls.gym_id = wallrooms.gym_id and walls.wall = wallrooms.wall where walls.gym_id = ? group by walls.wallimage_original, walls.gym_id, walls.wall, wallrooms.wall_update_time, wallrooms.wall_change_time;`,
    [gym_id]
  );
  return rows;
}

export async function getRoom(tag_room_id, today) {
  let [rows, fields] = await pool.query(
    `select * from wallrooms where tag_room_id = ? and wall_change_time > ? `,
    [tag_room_id, today]
  );
  return rows[0];
}

export async function getRoomId(tag_room_id, today) {
  let [rows, fields] = await pool.query(
    `select wallroomId from wallrooms where tag_room_id = ? and wall_change_time > ? `,
    [tag_room_id, today]
  );
  return rows[0];
}

export async function getRoombySearch(search) {
  let [rows, fields] = await pool.query(
    `select * from wallrooms where ${search}`
  );
  return rows;
}

// export async function getRole(user_id) {
//   let [rows, fields] = await pool.query(
//     `select * from user_admin where user_id = ? `,
//     [user_id]
//   );
//   return rows;
// }

// CREATE TABLE wallrooms (wallroomId int PRIMARY KEY AUTO_INCREMENT,wallimage varchar(255),official_level varchar(255),gym_id varchar(255),wall varchar(255),color varchar(255));
