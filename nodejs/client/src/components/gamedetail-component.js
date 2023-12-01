import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Input, Space, Button, Row, Col, Table } from "antd";

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
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const columns = [
    {
      title: "參賽者",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "已完成的牆面數量",
      dataIndex: "completeWalls",
      key: "completeWalls",
    },
  ];

  const dataSource = userRankResults?.map((user) => {
    return {
      userId: user.user_id,
      rank: user.user_rank ?? "已參賽",
      completeWalls: user.complete_walls_count,
    };
  });

  return (
    <div id="gamedetail-container">
      {data ? (
        <div>
          <img
            src={
              "https://d23j097i06b1t0.cloudfront.net/" +
              data.gameInfo[0].main_image
            }
            style={{ maxWidth: "1920px", maxHeight: "500px" }}
          />
          <br></br>

          <Card title="比賽資訊">
            <Row>
              <div>
                <p>比賽序號 : {data.gameInfo[0].game_id}</p>
                <p>比賽名稱: {data.gameInfo[0].name}</p>
                <p>比賽內容: {data.gameInfo[0].long_description}</p>
                <p>開始日期: {formatDate(data.gameInfo[0].date_start)}</p>
                <p>結束日期: {formatDate(data.gameInfo[0].date_end)}</p>
                <p>獲勝人數: {data.gameInfo[0].game_winners}</p>
                <p>精美獎品: {data.gameInfo[0].game_award}</p>
              </div>
              <div>
                <img
                  id="gamedetail-second-image"
                  src={
                    "https://d23j097i06b1t0.cloudfront.net/" +
                    data.gameInfo[0].second_image
                  }
                  style={{ maxWidth: "800px", maxHeight: "600px" }}
                />
              </div>
            </Row>
          </Card>
          <br></br>
          <Button block size="large" type="text" onClick={handleJoinActivity}>
            參加比賽
          </Button>
          <br></br>
          <br></br>
          <br></br>
          <Card title="挑戰賽線">
            <Row>
              {data.wallroomInfo.map((wallroom) => (
                <Col
                  key={wallroom.wallroomId}
                  onClick={() => handleResultClick(wallroom.tag_room_id)}
                  span={12}
                >
                  <Card>
                    <div>
                      {/* <p>WallroomId : {wallroom.tag_room_id}</p> */}
                      <strong>點擊進入聊天室</strong>
                      <p>
                        岩牆: {wallroom.gym_id} {wallroom.wall} {wallroom.color}
                      </p>
                      <p>Official Level: {wallroom.official_level}</p>
                    </div>
                    <div>
                      <Image height={300} src={wallroom.wallimage} />
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
          <br></br>
          <Table dataSource={dataSource} columns={columns} size="small" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameDetailComponent;
