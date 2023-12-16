import express from "express";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
import Click from "../models/clicks-model.js";
import {
  getCompleteUsers,
  getCompleteWalls,
  getGameDashboard,
} from "../models/dashboard-model.js";

router.get("/", async (req, res) => {
  try {
    const { creator } = req.query;

    let gameBasicInfo = await getGameDashboard(creator);

    let gameInfo = [];
    for (let i = 0; i < gameBasicInfo.length; i++) {
      const game = gameBasicInfo[i];
      const gameId = game.game_id;
      const totalUsers = await getCompleteUsers(gameId);
      const completeWalls = await getCompleteWalls(gameId);
      let completeCount = 0;
      let incompleteCount = 0;

      totalUsers.forEach((item) => {
        if (item.is_complete === 1) {
          completeCount += item.total_users;
        } else {
          incompleteCount += item.total_users;
        }
      });

      const pieChartData = {
        labels: ["完成比賽", "未完成比賽"],
        datasets: [
          {
            label: "人數",
            data: [completeCount, incompleteCount],
            backgroundColor: ["rgba(213, 52, 35, 1)", "rgba(0, 0, 0, 0.6)"],
            borderColor: ["rgba(213, 52, 35, 1)", "rgba(0, 0, 0, 0.6)"],
            borderWidth: 1,
          },
        ],
      };

      const adClick = await Click.find({
        searchId: game.ad_status_id,
        type: "ad_click",
      }).select("-_id  date type clickCount");

      const gameAndUserClick = await Click.find({
        searchId: gameId,
      }).select("-_id  date type clickCount");
      const rawData = adClick.concat(gameAndUserClick);

      const uniqueDates = [...new Set(rawData.map((item) => item.date))].sort();

      const groupedData = rawData.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = {};
        }
        acc[item.type][item.date] =
          (acc[item.type][item.date] || 0) + item.clickCount;
        return acc;
      }, {});

      const colors = {
        ad_click: "rgba(0, 0, 154, 1)",
        game_click: "rgba(0, 0, 0, 1)",
        user_join: "rgba(213, 52, 35, 1)",
      };

      const typeName = {
        ad_click: "廣告點擊",
        game_click: "挑戰賽點擊",
        user_join: "使用者參賽",
      };

      const datasets = Object.keys(groupedData).map((type) => {
        return {
          label: typeName[type],
          data: uniqueDates.map((date) => groupedData[type][date] || 0),
          backgroundColor: colors[type],
          borderColor: colors[type],
          borderWidth: 1,
        };
      });

      // Final data structure for Chart.js
      const chartData = {
        labels: uniqueDates,
        datasets: datasets,
      };

      const data = {
        game,
        totalUsers: totalUsers,
        pieChartData: pieChartData,
        completeWalls: completeWalls[0].total_complete_walls,
        clicks: chartData,
      };
      gameInfo.push(data);
    }

    res.status(200).json(gameInfo);
  } catch (err) {
    console.log(err);
  }
});

router.get("/adclick", async (req, res) => {
  try {
    const { ad_status_id } = req.query;

    if (!ad_status_id) {
      res.status(400).json("No ad click data");
    }

    const today = new Date(Date.now());
    let formattedDate = today.toISOString().split("T")[0];

    const findAdDate = await Click.find({
      date: formattedDate,
      searchId: ad_status_id,
      type: "ad_click",
    }).select("-_id clickCount");
    console.log(findAdDate);

    if (findAdDate.length == 0) {
      const saveClick = new Click({
        searchId: ad_status_id,
        date: formattedDate,
        type: "ad_click",
        clickCount: 1,
      });
      await saveClick.save();
    } else {
      await Click.updateOne(
        { date: formattedDate, searchId: ad_status_id, type: "ad_click" },
        { $inc: { clickCount: 1 } },
        { new: true }
      );
    }

    res.status(200).json("Ad click add one.");
  } catch (err) {
    console.log(err);
  }
});

router.get("/gameclick", async (req, res) => {
  try {
    const { game_id } = req.query;

    if (!game_id) {
      res.status(400).json("No game click data");
    }

    const today = new Date(Date.now());
    let formattedDate = today.toISOString().split("T")[0];

    const findGameDate = await Click.find({
      date: formattedDate,
      searchId: game_id,
      type: "game_click",
    }).select("-_id clickCount");
    console.log(findGameDate);

    if (findGameDate.length == 0) {
      const saveClick = new Click({
        searchId: game_id,
        date: formattedDate,
        type: "game_click",
        clickCount: 1,
      });
      await saveClick.save();
    } else {
      await Click.updateOne(
        { date: formattedDate, searchId: game_id, type: "game_click" },
        { $inc: { clickCount: 1 } },
        { new: true }
      );
    }

    res.status(200).json("Game click add one.");
  } catch (err) {
    console.log(err);
  }
});

router.get("/mockdata", async (req, res) => {
  let game_id = "64";
  let ad_status_id = "51";
  let count = Math.floor(Math.random() * 5);
  //mock data
  for (let i = 0; i < 30; i++) {
    const anotherDay = new Date(Date.now());
    anotherDay.setDate(anotherDay.getDate() + i);
    let formattedDate = anotherDay.toISOString().split("T")[0];
    const saveClick = new Click({
      searchId: game_id,
      date: formattedDate,
      type: "game_click",
      clickCount: count,
    });
    await saveClick.save();
  }
  //mock data
  for (let i = 0; i < 10; i++) {
    const anotherDay = new Date(Date.now());
    anotherDay.setDate(anotherDay.getDate() + i);
    let formattedDate = anotherDay.toISOString().split("T")[0];
    const saveClick = new Click({
      searchId: ad_status_id,
      date: formattedDate,
      type: "ad_click",
      clickCount: count,
    });
    await saveClick.save();
  }

  for (let i = 0; i < 10; i++) {
    const anotherDay = new Date(Date.now());
    anotherDay.setDate(anotherDay.getDate() + i);
    let formattedDate = anotherDay.toISOString().split("T")[0];
    const saveClick = new Click({
      searchId: game_id,
      date: formattedDate,
      type: "user_join",
      clickCount: count,
    });
    await saveClick.save();
  }
  res.status(200).json("Add mock data success");
});
export default router;
