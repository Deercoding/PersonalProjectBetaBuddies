import { pool } from "../utils/sqlpool.js";

export async function createVideo(
  wallroomId,
  video_link,
  comments,
  user_level,
  userId,
  userName
) {
  let result = await pool.query(
    `insert into betavideos(wallroomId,video_link,comments,user_level,userId, userName) values(?,?,?,?,?,?)`,
    [wallroomId, video_link, comments, user_level, userId, userName]
  );
  console.log(result);
}

export async function getVideos(wallroomId) {
  let [rows, fields] = await pool.query(
    `select video_link, comments, user_level, userName from betavideos where wallroomId = ? `,
    [wallroomId]
  );
  return rows;
}

export async function countVideos(wallroomId) {
  let [rows, fields] = await pool.query(
    `select count(*) as videoCount from betavideos where wallroomId = ? `,
    [wallroomId]
  );
  return rows[0];
}
