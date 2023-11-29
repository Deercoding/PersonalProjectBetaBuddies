import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameListComponent = ({ setGameId }) => {
  const [gameList, setGameList] = useState([]);
  let navigate = useNavigate();

  const handleResultClick = (game_id) => {
    setGameId(game_id);
    navigate("/gamedetail");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/game/list");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setGameList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <p>This is GameListComponent</p>
      <ul>
        {gameList.map((game) => (
          <li
            key={game.game_id}
            onClick={() => handleResultClick(game.game_id)}
          >
            <p>Name: {game.name}</p>
            <p>Description: {game.short_description}</p>
            <p>GameId : {game.game_id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameListComponent;
