import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socketio.js";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MessageBox } from "react-chat-elements";
import {
  Image,
  Card,
  Input,
  Space,
  Button,
  Carousel,
  Tag,
  Statistic,
  Row,
} from "antd";
const { Countdown } = Statistic;

const WallroomComponent = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [videoDetail, setVideoDetail] = useState([]);
  const [gameInfo, setGameInfo] = useState([]);

  let navigate = useNavigate();
  let userinfo = localStorage.getItem("userInfo");
  let userName = "岩友";
  if (userinfo) {
    userName = userinfo.split(",")[1];
  }

  const { roomId } = useParams();

  const BetaUpload = () => {
    navigate(`/betaupload/${roomId}`);
  };

  useEffect(() => {
    fetchChatHistory(roomId);
    fetchRoomInfo(roomId);
    fetchVideoDetail(roomId);
    fetchGameInfo(roomId);

    socket.on("connect", (response) => {
      console.log(`You connect with id ${socket.id}`);
    });
    socket.on("talk", (response) => {
      const { message, userName } = response;
      setNewMessages((prevMessages) => [
        ...prevMessages,
        { userName: userName, message: message },
      ]);
    });
    return () => {
      socket.off("connect"); //clean up the connection
      socket.off("talk");
    };
  }, [roomId]);

  const sendMessage = () => {
    const userIdentify = {
      userName: userName,
      roomNumericId: roomId,
      roomName: roomInfo.roomName,
    };
    if (inputValue) {
      socket.emit("talk", inputValue, userIdentify);
      setInputValue("");
    }
  };

  const fetchChatHistory = async (roomId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/chat?roomId=${roomId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const chatHistory = await response.json();
      setChatHistory(
        chatHistory.map((message) => ({
          userName: message.userName,
          message: message.content,
        }))
      );
    } catch (error) {
      console.error(`Error fetching chat history: ${error}`);
    }
  };
  const fetchRoomInfo = async (roomId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/wallchatroom?roomId=${roomId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const roomInfo = await response.json();

      // Update the state with the fetched room info
      setRoomInfo({
        roomName: roomInfo.roomName,
        officialLevel: roomInfo.officialLevel,
        tags: roomInfo.tags,
        wallImage: roomInfo.wallImage,
        wallUpdateDate: roomInfo.wallUpdateDate,
        wallChangeDate: roomInfo.wallChangeDate,
      });
    } catch (error) {
      console.error(`Error fetching room info: ${error}`);
    }
  };

  const fetchVideoDetail = async (roomId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/beta?roomId=${roomId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const betaDetailData = await response.json();

      setVideoDetail(
        betaDetailData.map((video) => ({
          video_link: video.video_link,
          comments: video.comments,
          user_level: video.user_level,
          userName: video.userName,
        }))
      );
    } catch (error) {
      console.error(`Error fetching beta detail: ${error}`);
    }
  };

  const fetchGameInfo = async (roomId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/search/gamerooms?roomId=${roomId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const gameInfo = await response.json();
      setGameInfo(gameInfo);
    } catch (error) {
      console.error(`Error fetching room info: ${error}`);
    }
  };

  const onChange = (currentSlide) => {
    console.log("Carousel changed to slide:", currentSlide);
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div id="outer-wallroom-container">
      <div id="wallroom-container">
        <div>
          <div id="wallroom-container-upper">
            <Card title={roomInfo.roomName}>
              <Card type="inner" title="基本資訊">
                <p>岩牆: {roomInfo.roomName}</p>
                <p>官方等級: {roomInfo.officialLevel}</p>
                <p>更新時間: {formatDate(roomInfo.wallUpdateDate)}</p>
                <p>換牆時間: {formatDate(roomInfo.wallChangeDate)}</p>
              </Card>
              <br></br>

              {roomInfo.tags &&
                roomInfo.tags.map((tag, index) => (
                  <Space size={[0, 8]} wrap>
                    <Tag color="rgb(213, 52, 35)" style={{ fontSize: "15px" }}>
                      {"#" + tag}
                    </Tag>
                  </Space>
                ))}
            </Card>
            <Card title="岩牆圖片: 點擊圖片放大">
              <Image width={250} src={roomInfo.wallImage} />
            </Card>
          </div>
          <br></br>
          <Card title="留言區">
            <div id="chat-history-card">
              {chatHistory.map((message, index) => (
                <MessageBox
                  position={"left"}
                  type={"text"}
                  text={`${message.userName}:${message.message}`}
                />
              ))}

              {newMessages.map((message, index) => (
                <MessageBox
                  position={"left"}
                  type={"text"}
                  text={`${message.userName}:${message.message}`}
                />
              ))}
            </div>
            <br></br>
            <Space.Compact
              style={{
                width: "100%",
              }}
            >
              <Input
                defaultValue="Combine input and button"
                id="input"
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="text" onClick={() => sendMessage()}>
                送出
              </Button>
            </Space.Compact>
          </Card>

          <br></br>
          <Card id="carousel-card" title="看看別人的Beta影片">
            <div id="carousel-container">
              <Carousel
                afterChange={onChange}
                autoplay
                dotPosition={"left"}
                dots={{ style: { color: "red" } }}
              >
                {videoDetail.map((video, index) => (
                  <div key={`video_${index}`} id="video">
                    <div height="50px">
                      <strong>用戶:</strong> {video.userName}
                      <br />
                      <strong>體感等級:</strong> {video.user_level}
                      <br />
                      <strong>評論:</strong> {video.comments}
                      <br />
                    </div>
                    <video height="350px" controls>
                      <source src={video.video_link} type="video/mp4" />
                    </video>
                    <br />
                  </div>
                ))}
              </Carousel>
            </div>
            <Button type="text" onClick={BetaUpload}>
              上傳我的Beta
            </Button>
          </Card>
          <br></br>
          <div id="game-wallroom-container">
            {gameInfo.map((game, index) => (
              <Row>
                <Card title="上傳Beta影片就能參加比賽">
                  <div>
                    <h3> | {game.name} | 指定線路</h3>

                    <p> 挑戰賽 結束時間倒數 </p>

                    <Countdown
                      value={game.date_end}
                      format="D 天 H 小時 m 分 s 秒"
                      valueStyle={{ color: "#cf1322" }}
                    />
                    <br></br>
                    <Image
                      style={{ maxWidth: "960px", maxHeight: "250px" }}
                      src={
                        "https://d23j097i06b1t0.cloudfront.net/" +
                        game.main_image
                      }
                      preview={false}
                    />
                    <Link to="/gamelist" style={{ color: "#cf1322" }}>
                      | 觀看更多挑戰賽 |
                    </Link>
                  </div>
                </Card>
              </Row>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallroomComponent;
