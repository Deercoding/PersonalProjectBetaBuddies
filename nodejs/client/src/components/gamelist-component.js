import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select } from "antd";

const GameListComponent = () => {
  const [gameList, setGameList] = useState([]);
  const [gameAd, setGameAd] = useState([]);
  let navigate = useNavigate();

  const handleResultClick = (game_id) => {
    navigate(`/gamedetail/${game_id}`);
  };

  const handleAdClick = () => {
    if (gameAd.game_id) {
      navigate(`/gamedetail/${gameAd.game_id}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let gameList = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/game/list`
      );
      gameList = await gameList.json();

      let gameAd = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/ad/?ad_location_id=2`
      );
      gameAd = await gameAd.json();
     
      if (gameAd.length > 0) {
        setGameAd(gameAd[0]);
      } else {
        setGameAd({
          ad_image: "game-main-image.jpg_1701348260614.jpg",
        });
      }

      setGameList(gameList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
            src={`https://d23j097i06b1t0.cloudfront.net/${gameAd.ad_image}`}
            preview={false}
            onClick={() => handleAdClick()}
          />
        </div>
        <br></br>
        <br></br>
        <h3>挑戰賽進行中</h3>
        {gameList
          .filter((game) => game.game_status == 1)
          .map((game) => (
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
                        "https://d23j097i06b1t0.cloudfront.net/" +
                        game.main_image
                      }
                      preview={false}
                    />
                  </div>
                </Row>
              </Card>
            </Row>
          ))}{" "}
        <h3> 即將上線</h3>
        {gameList
          .filter((game) => game.game_status == 2)
          .map((game) => (
            <Row key={game.game_id}>
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
                        "https://d23j097i06b1t0.cloudfront.net/" +
                        game.main_image
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
