import Click from "../models/clicks-model.js";

export async function countUserJoinClick(gameId) {
  const today = new Date();
  let formattedDate = today.toISOString().split("T")[0];

  const findGame = await Click.find({
    date: formattedDate,
    searchId: gameId,
    type: "user_join",
  }).select("-_id clickCount");

  if (findGame.length == 0) {
    const saveClick = new Click({
      searchId: gameId,
      date: formattedDate,
      type: "user_join",
      clickCount: 1,
    });
    await saveClick.save();
  } else {
    await Click.updateOne(
      { date: formattedDate, searchId: gameId, type: "user_join" },
      { $inc: { clickCount: 1 } },
      { new: true }
    );
  }
  return "User click updated";
}
