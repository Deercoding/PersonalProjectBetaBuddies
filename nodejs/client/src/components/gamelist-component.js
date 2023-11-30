import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select } from "antd";

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
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div id="outer-gamelist-container">
      <div id="gamelist-container">
        <div>
          <Image
            style={{ maxHeight: "400px" }}
            src={"https://d23j097i06b1t0.cloudfront.net/ad-image-long.jpg"}
            preview={false}
          />
        </div>
        <br></br>
        {gameList.map((game) => (
          <Row
            key={game.game_id}
            onClick={() => handleResultClick(game.game_id)}
          >
            <Card id="gamelist-card">
              <Row>
                <div id="home-wall-info">
                  <p>比賽序號 : {game.game_id}</p>
                  <p>比賽名稱: {game.name}</p>
                  <p>比賽內容: {game.short_description}</p>
                  <p>開始日期: {formatDate(game.date_start)}</p>
                  <p>結束日期: {formatDate(game.date_end)}</p>
                </div>
                <br></br>
                <div>
                  <Image
                    style={{ maxWidth: "960px", maxHeight: "250px" }}
                    src={
                      "https://d23j097i06b1t0.cloudfront.net/" + game.main_image
                    }
                    preview={false}
                  />
                </div>
              </Row>
            </Card>
          </Row>
        ))}{" "}
      </div>
    </div>
  );
};

export default GameListComponent;
