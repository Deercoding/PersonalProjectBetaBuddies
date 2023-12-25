import {
  getConnection,
  beginSQL,
  commitSQL,
  rollbackSQL,
  releaseConnection,
  lockGameUser,
  oneGameUserStatus,
  checkGameUserWalls,
  updateUserWalls,
  countgGamewallsbyId,
  gameMaxRank,
  updateUserWallsComplete,
  checkWallandUserinGame,
} from "../models/game-model.js";

export async function updateGameRank(roomNumericId, userId) {
  let gameUsers = await checkWallandUserinGame(roomNumericId, userId);

  if (gameUsers.length == 0) {
    return "Not in Game. Beta video upload success";
  }

  for (const gameUser of gameUsers) {
    const oneGameId = gameUser.game_id;
    let connection = await getConnection();
    try {
      await beginSQL(connection);
      await lockGameUser(oneGameId, connection);

      //update walls
      const game_users_id = gameUser.game_users_id;
      let userWalls = await checkGameUserWalls(
        game_users_id,
        roomNumericId,
        connection
      );

      if (userWalls.length == 0) {
        await updateUserWalls(
          game_users_id,
          roomNumericId,
          game_users_id,
          connection
        );
      } else {
        await commitSQL(connection);
        await releaseConnection(connection);
        return "No update on wall count. Beta video upload success";
      }

      //rank
      let countGamewalls = await countgGamewallsbyId(oneGameId);
      countGamewalls = countGamewalls[0].count_walls;
      let oneUserOneGame = await oneGameUserStatus(
        oneGameId,
        userId,
        connection
      );

      if (oneUserOneGame.complete_walls_count == countGamewalls) {
        let maxRank = await gameMaxRank(oneGameId, connection);
        maxRank = maxRank.max_rank;

        if (maxRank > 0) {
          await updateUserWallsComplete(maxRank + 1, game_users_id, connection);
        } else {
          await updateUserWallsComplete(1, game_users_id, connection);
        }
      } else {
        await commitSQL(connection);
        await releaseConnection(connection);
        return "No update on rank. Beta video upload success";
      }

      await commitSQL(connection);
      await releaseConnection(connection);
      return "Game logic upload success";
    } catch (err) {
      console.log(err);
      await rollbackSQL(connection);
      await releaseConnection(connection);
      return "Game logic upload fail";
    }
  }
}
