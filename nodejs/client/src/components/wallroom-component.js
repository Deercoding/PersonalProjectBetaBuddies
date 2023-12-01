import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socketio.js";
import { useNavigate } from "react-router-dom";
import { Image, Card, Input, Space, Button, Carousel } from "antd";
import { MessageBox } from "react-chat-elements";

const WallroomComponent = ({ roomId }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [videoDetail, setVideoDetail] = useState([]);

  let navigate = useNavigate();
  const jwtToken = localStorage.getItem("Authorization");
  const userinfo = localStorage.getItem("userInfo").split(",");

  // Local storage
  const tagRoomId = roomId;
  const userName = userinfo[1];

  const BetaUpload = () => {
    navigate("/betaupload");
  };

  useEffect(() => {
    fetchChatHistory(tagRoomId);
    fetchRoomInfo(tagRoomId);
    fetchVideoDetail(tagRoomId);

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
  }, []);

  const sendMessage = () => {
    const userIdentify = {
      userName: userName,
      roomNumericId: tagRoomId,
      roomName: roomInfo.roomName,
    };
    if (inputValue) {
      socket.emit("talk", inputValue, userIdentify);
      setInputValue("");
    }
  };

  const fetchChatHistory = async (tagRoomId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + "api/chat/history",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tagRoomId }),
        }
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
  const fetchRoomInfo = async (tagRoomId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + "api/wallchatroom/detail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tagRoomId }),
        }
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

  const fetchVideoDetail = async (tagRoomId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + "api/beta/detail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tagRoomId }),
        }
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
              <Card type="inner" title="主題標籤">
                {roomInfo.tags && roomInfo.tags.join(", ")}
              </Card>
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
                Submit
              </Button>
            </Space.Compact>
          </Card>

          <br></br>
          <Card id="carousel-card" title="看看別人的Beta">
            <div id="carousel-container">
              <Carousel
                afterChange={onChange}
                autoplay
                dotPosition={"left"}
                dots={{ style: { color: "red" } }}
              >
                {videoDetail.map((video, index) => (
                  <li key={`video_${index}`}>
                    <strong>用戶:</strong> {video.userName}
                    <br />
                    <strong>體感等級:</strong> {video.user_level}
                    <br />
                    <strong>評論:</strong> {video.comments}
                    <br />
                    <video width="180" controls>
                      <source src={video.video_link} type="video/mp4" />
                    </video>
                    <br />
                  </li>
                ))}
              </Carousel>
            </div>
            <div id="navigate-to-beta-upload">
              <Button type="text" onClick={BetaUpload}>
                上傳我的Beta
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WallroomComponent;
