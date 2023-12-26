import { updateGameRank } from "../controller/gameLogic";
import {
  checkWallandUserinGame,
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
} from "../models/game-model.js";

// Mocking the external dependencies

jest.mock("../models/game-model.js", () => ({
  checkWallandUserinGame: jest.fn(),
  getConnection: jest.fn(),
  beginSQL: jest.fn(),
  commitSQL: jest.fn(),
  rollbackSQL: jest.fn(),
  releaseConnection: jest.fn(),
  lockGameUser: jest.fn(),
  oneGameUserStatus: jest.fn(),
  checkGameUserWalls: jest.fn(),
  updateUserWalls: jest.fn(),
  countgGamewallsbyId: jest.fn(),
  gameMaxRank: jest.fn(),
  updateUserWallsComplete: jest.fn(),
}));

describe("gameLogicValidation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return "Not in Game" user and wall is not in game', async () => {
    const wallId = "123";
    const userId = "3";
    checkWallandUserinGame.mockImplementation(() => {
      return [];
    });
    const response = await updateGameRank(wallId, userId);
    expect(response).toBe("Not in Game. Beta video upload success");
    expect(checkWallandUserinGame).toHaveBeenCalled();
  });

  it('should return "No update on wall count" if user wall already updated', async () => {
    const wallId = "123";
    const userId = "3";
    checkWallandUserinGame.mockImplementation(() => {
      return [
        {
          game_wallrooms_id: 59,
        },
      ];
    });
    checkGameUserWalls.mockImplementation(() => {
      return [
        {
          game_user_walls_id: 48,
          game_user_id: 91,
          wall_id: "6566b2f2b119df255098b304",
        },
      ];
    });

    const response = await updateGameRank(wallId, userId);
    expect(response).toBe("No update on wall count. Beta video upload success");
    expect(checkWallandUserinGame).toHaveBeenCalled();

    expect(getConnection).toHaveBeenCalled();
    expect(beginSQL).toHaveBeenCalled();
    expect(lockGameUser).toHaveBeenCalled();

    expect(checkGameUserWalls).toHaveBeenCalled();

    expect(commitSQL).toHaveBeenCalled();
    expect(releaseConnection).toHaveBeenCalled();
  });

  it('should return "No update on rank" when user did not complete all walls yet', async () => {
    const wallId = "123";
    const userId = "3";
    checkWallandUserinGame.mockImplementation(() => {
      return [
        {
          game_wallrooms_id: 59,
        },
      ];
    });
    checkGameUserWalls.mockImplementation(() => {
      return [];
    });
    countgGamewallsbyId.mockImplementation(() => {
      return [
        {
          count_walls: 2,
        },
      ];
    });
    oneGameUserStatus.mockImplementation(() => {
      return [
        {
          complete_walls_count: 1,
        },
      ];
    });
    const response = await updateGameRank(wallId, userId);
    expect(response).toBe("No update on rank. Beta video upload success");
    expect(checkWallandUserinGame).toHaveBeenCalled();

    expect(getConnection).toHaveBeenCalled();
    expect(beginSQL).toHaveBeenCalled();
    expect(lockGameUser).toHaveBeenCalled();
    expect(checkGameUserWalls).toHaveBeenCalled();

    expect(updateUserWalls).toHaveBeenCalled();

    expect(countgGamewallsbyId).toHaveBeenCalled();
    expect(oneGameUserStatus).toHaveBeenCalled();
    expect(commitSQL).toHaveBeenCalled();
    expect(releaseConnection).toHaveBeenCalled();
  });

  it('should return "Game logic upload success" when rank updated', async () => {
    const wallId = "123";
    const userId = "3";
    checkWallandUserinGame.mockImplementation(() => {
      return [
        {
          game_wallrooms_id: 59,
        },
      ];
    });
    checkGameUserWalls.mockImplementation(() => {
      return [];
    });
    countgGamewallsbyId.mockImplementation(() => {
      return [
        {
          count_walls: 2,
        },
      ];
    });
    oneGameUserStatus.mockImplementation(() => {
      return { complete_walls_count: 2 };
    });
    gameMaxRank.mockImplementation(() => {
      return { max_rank: 2 };
    });

    const response = await updateGameRank(wallId, userId);
    expect(response).toBe("Game logic upload success");
    expect(checkWallandUserinGame).toHaveBeenCalled();

    expect(getConnection).toHaveBeenCalled();
    expect(beginSQL).toHaveBeenCalled();
    expect(lockGameUser).toHaveBeenCalled();

    expect(checkGameUserWalls).toHaveBeenCalled();
    expect(updateUserWalls).toHaveBeenCalled();

    expect(countgGamewallsbyId).toHaveBeenCalled();
    expect(oneGameUserStatus).toHaveBeenCalled();
    expect(gameMaxRank).toHaveBeenCalled();
    expect(updateUserWallsComplete).toHaveBeenCalled();

    expect(commitSQL).toHaveBeenCalled();
    expect(releaseConnection).toHaveBeenCalled();
  });

  it('should return "Game logic upload fail" when catch error', async () => {
    const wallId = "123";
    const userId = "3";
    checkWallandUserinGame.mockImplementation(() => {
      return [
        {
          game_wallrooms_id: 59,
        },
      ];
    });
    checkGameUserWalls.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const response = await updateGameRank(wallId, userId);
    expect(response).toBe("Game logic upload fail");
    expect(checkWallandUserinGame).toHaveBeenCalled();

    expect(getConnection).toHaveBeenCalled();
    expect(beginSQL).toHaveBeenCalled();
    expect(lockGameUser).toHaveBeenCalled();

    expect(checkGameUserWalls).toHaveBeenCalled();
    expect(rollbackSQL).toHaveBeenCalled();

    expect(releaseConnection).toHaveBeenCalled();
  });
});
