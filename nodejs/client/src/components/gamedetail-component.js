import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image, Card, Input, Space, Button, Row, Col, Table } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

const GameDetailComponent = () => {
  const [data, setData] = useState(null);
  const [joinActivityStatus, setJoinActivityStatus] = useState(null);
  const [userRankResults, setUserRankResults] = useState(null);
  let navigate = useNavigate();
  const { gameId } = useParams();

  useEffect(() => {
    if (gameId) {
      fetchGame();
      getUserRank();
    } else {
      navigate("/");
    }
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/game/detail?gameId=${gameId}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserRank = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/game/user?gameId=${gameId}`
      );
      const result = await response.json();
      const sortedResults = result.sort((a, b) => a.user_rank - b.user_rank);
      setUserRankResults(sortedResults);
    } catch (error) {
      console.error("Error fetching user rank:", error);
    }
  };
  function sendData(result) {
    document.getElementById("server").innerHTML = JSON.stringify(result);
  }
  const handleJoinActivity = async () => {
    try {
      let userId = localStorage.getItem("userInfo");
      if (userId) {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}api/game/user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              gameId: gameId,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          setJoinActivityStatus(result.status);
          getUserRank();
          sendData(`成功加入挑戰賽, 請查看底下挑戰賽排名`);
        } else {
          const result = await response.json();
          sendData(`Error: ${result}`);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleResultClick = (roomNumericId) => {
    navigate(`/wallroom/${roomNumericId}`);
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
      sorter: (a, b) => {
        if (a.rank === "已參賽") return -1; 
        if (b.rank === "已參賽") return 1; 
        return a.rank - b.rank;
      },
    },
    {
      title: "已完成的路線數量",
      dataIndex: "completeWalls",
      key: "completeWalls",
    },
  ];

  const dataSource = userRankResults?.map((user) => {
    return {
      userId: user.name,
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
          <h3 id="server"></h3>
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
                  <Card style={{ cursor: "pointer" }}>
                    <div>
                      {/* <p>WallroomId : {wallroom.tag_room_id}</p> */}
                      <strong>點擊進入聊天室</strong>
                      <p>
                        岩牆: {wallroom.gym_id} {wallroom.wall} {wallroom.color}
                      </p>
                      <p>官方等級: V{wallroom.official_level}</p>
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
          <Card style={{ textAlign: "center" }}>
            <strong style={{ color: "#cf1322" }}>
              <TrophyOutlined />
              比賽辦法: 上傳Beta影片完成路線 | 最先完成全部指定路線者勝利
            </strong>
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
