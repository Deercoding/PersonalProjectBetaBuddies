import React, { useEffect, useState, useRef } from "react";
import { socket } from "../socketio.js";

const WallroomComponent = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [videoDetail, setVideoDetail] = useState([]);

  // Local storage
  const tagRoomId = "6563229f5a5158b0bd6b5f71"; // Replace with the actual tagRoomId
  const userId = "userId";

  useEffect(() => {
    fetchChatHistory(tagRoomId);
    fetchRoomInfo(tagRoomId);
    fetchVideoDetail(tagRoomId);

    socket.on("connect", (response) => {
      console.log(`You connect with id ${socket.id}`);
    });
    socket.on("talk", (response) => {
      const { message, userId } = response;
      setNewMessages((prevMessages) => [
        ...prevMessages,
        { userId: userId, message: message },
      ]);
    });
    return () => {
      socket.off("connect"); //clean up the connection
      socket.off("talk");
    };
  }, []);

  const sendMessage = () => {
    const userIdentify = {
      userId: userId,
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
          userId: message.userId,
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
      console.log(betaDetailData);
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
  return (
    <div id="chat-container">
      <div id="room-info">
        <h3>Room Information</h3>
        <strong>Room Name:</strong> {roomInfo.roomName}
        <br />
        <strong>Official Level:</strong> {roomInfo.officialLevel}
        <br />
        <strong>Tags:</strong> {roomInfo.tags && roomInfo.tags.join(", ")}
        <br />
        <img
          src={roomInfo.wallImage}
          alt="Room Image"
          style={{ maxWidth: "300px" }}
        />
      </div>
      <div id="chat-history">
        <h3>Chat History</h3>
        <p>
          {chatHistory.map((message, index) => (
            <li key={`chat_${index}`}>
              {message.userId}: {message.message}
            </li>
          ))}
        </p>
        <p>
          {newMessages.map((message, index) => (
            <li key={`new_${index}`}>
              {message.userId}: {message.message}
            </li>
          ))}
        </p>
      </div>

      <input
        id="input"
        autoComplete="off"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={() => sendMessage()}>Send</button>

      <div id="beta-detail">
        <h3>Beta Detail</h3>
        <ul>
          {videoDetail.map((video, index) => (
            <li key={`video_${index}`}>
              <strong>User:</strong> {video.userName}
              <br />
              <strong>User Level:</strong> {video.user_level}
              <br />
              <strong>Comments:</strong> {video.comments}
              <br />
              <video width="320" height="240" controls>
                <source src={video.video_link} type="video/mp4" />
              </video>
              <br />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WallroomComponent;
