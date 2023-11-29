import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameDetailComponent = ({ gameId, setRoomId }) => {
  const [data, setData] = useState(null);
  const [joinActivityStatus, setJoinActivityStatus] = useState(null);
  const [userRankResults, setUserRankResults] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    fetchGame();
    getUserRank();
  }, []);

  const fetchGame = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/game/detail?gameId=${gameId}`
      );
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserRank = async () => {
    try {
      gameId = gameId;

      const response = await fetch(
        `http://localhost:8080/api/game/user?gameId=${gameId}`
      );
      const result = await response.json();
      const sortedResults = result.sort((a, b) => a.user_rank - b.user_rank);
      setUserRankResults(sortedResults);
    } catch (error) {
      console.error("Error fetching user rank:", error);
    }
  };
  const handleJoinActivity = async () => {
    try {
      const userId = localStorage.getItem("userInfo").split(",")[0];
      gameId = gameId;

      const response = await fetch("http://localhost:8080/api/game/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          gameId: gameId,
        }),
      });
      const result = await response.json();
      setJoinActivityStatus(result.status);
      getUserRank();
    } catch (error) {
      console.error("Error joining activity:", error);
    }
  };
  const handleResultClick = (roomNumericId) => {
    setRoomId(roomNumericId);
    navigate("/wallroom");
  };

  return (
    <div>
      <h2>Game Detail</h2>
      <button onClick={handleJoinActivity}>Join Activity</button>
      {joinActivityStatus && <p>{joinActivityStatus}</p>}
      {data ? (
        <div>
          <h3>Game Information</h3>
          <p>GameId : {data.gameInfo[0].game_id}</p>
          <p>Name: {data.gameInfo[0].name}</p>
          <p>Short Description: {data.gameInfo[0].short_description}</p>
          <p>Long Description: {data.gameInfo[0].long_description}</p>
          <p>Start Date: {data.gameInfo[0].date_start}</p>
          <p>End Date: {data.gameInfo[0].date_end}</p>
          <p>Member Count: {data.gameInfo[0].member_count}</p>
          <p>Winners: {data.gameInfo[0].game_winners}</p>
          <p>Award: {data.gameInfo[0].game_award}</p>
          <img
            src={
              "https://d23j097i06b1t0.cloudfront.net/" +
              data.gameInfo[0].main_image
            }
            alt="Main Game Image"
            style={{ maxWidth: "10%" }}
          />
          <img
            src={
              "https://d23j097i06b1t0.cloudfront.net/" +
              data.gameInfo[0].second_image
            }
            alt="Second Game Image"
            style={{ maxWidth: "10%" }}
          />

          <h3>Wall Room Information</h3>
          {data.wallroomInfo.map((wallroom) => (
            <div
              key={wallroom.wallroomId}
              onClick={() => handleResultClick(wallroom.tag_room_id)}
            >
              <p>WallroomId : {wallroom.tag_room_id}</p>
              <p>Official Level: {wallroom.official_level}</p>
              <p>Gym ID: {wallroom.gym_id}</p>
              <p>Wall: {wallroom.wall}</p>
              <p>Color: {wallroom.color}</p>
              <p>Wall Update Time: {wallroom.wall_update_time}</p>
              <p>Wall Change Time: {wallroom.wall_change_time}</p>
              <img
                src={wallroom.wallimage}
                alt={`Wall Image ${wallroom.wallroomId}`}
                style={{ maxWidth: "10%" }}
              />
            </div>
          ))}
          {userRankResults && (
            <div>
              <h3>User Rank</h3>
              <ul>
                {userRankResults.map((user) => (
                  <li key={user.game_users_id}>
                    User ID: {user.user_id}, Rank: {user.user_rank}, Complete
                    walls: {user.complete_walls_count}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameDetailComponent;
