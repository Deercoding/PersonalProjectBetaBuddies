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
  createGame,
  lockAdLocation,
  updateAdStatus,
  checkAdInfo,
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

function dateToUtc(localDate) {
  const utcDate = new Date(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    localDate.getUTCHours(),
    localDate.getUTCMinutes(),
    localDate.getUTCSeconds()
  );
  return utcDate;
}

export async function createGameandAdvertisement(
  requestBody,
  requestFiles,
  connection
) {
  try {
    const {
      ad_location_id,
      ad_start_date,
      date_start,
      date_end,
      name,
      short_description,
      long_description,
      game_winners,
      game_award,
      creator,
    } = requestBody;

    await beginSQL(connection);

    const checkAdStatus = await lockAdLocation(ad_location_id, connection);
    const adLocationInfo = await checkAdInfo(ad_location_id);
    const adTimeLimit = adLocationInfo.ad_time_limit;
    let adStartDate = new Date(ad_start_date);
    let adEndDate = new Date(adStartDate);
    adEndDate.setDate(adStartDate.getDate() + Number(adTimeLimit));

    adEndDate = dateToUtc(adEndDate);
    adStartDate = dateToUtc(adStartDate);

    let hasOverlap = false;
    for (let i = 0; i < checkAdStatus.length; i++) {
      const oldAd = checkAdStatus[i];
      const oldAdStart = new Date(oldAd.start_date);
      const oldAdEnd = new Date(oldAd.end_date);
      const noOverlapCondition =
        adEndDate <= oldAdStart || adStartDate >= oldAdEnd;
      if (!noOverlapCondition) {
        hasOverlap = true;
        break;
      }
    }
    if (hasOverlap) {
      console.log("Ad location already in use.");
      await rollbackSQL(connection);
      await releaseConnection(connection);
      return "廣告日期已被預訂";
    }

    let dateStart = new Date(date_start);
    let dateEnd = new Date(date_end);
    dateStart = dateToUtc(dateStart);
    dateEnd = dateToUtc(dateEnd);
    let result = await createGame(
      name,
      short_description,
      long_description,
      dateStart,
      dateEnd,
      game_winners,
      game_award,
      requestFiles["main_image"][0].filename,
      requestFiles["second_image"][0].filename,
      ad_location_id,
      adStartDate,
      requestFiles["advertise_image"][0].filename,
      creator
    );

    const newGameId = result[0].insertId;
    await updateAdStatus(
      ad_location_id,
      true,
      newGameId,
      adStartDate,
      adEndDate,
      requestFiles["advertise_image"][0].filename,
      connection
    );

    await commitSQL(connection);
    await releaseConnection(connection);

    return newGameId;
  } catch (err) {
    await rollbackSQL(connection); //Server error - rollback
    await releaseConnection(connection);
    console.log(err);
    return "Server Error";
  }
}
