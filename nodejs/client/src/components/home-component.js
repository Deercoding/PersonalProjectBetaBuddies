import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select } from "antd";

const HomeComponent = ({ setRoomId }) => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const [officialLevel, setOfficialLevel] = useState("");
  const [gym, setGym] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  let navigate = useNavigate();

  const handleResultClick = (roomNumericId) => {
    setRoomId(roomNumericId);
    navigate("/wallroom");
  };

  const handleOfficialLevelChange = (event) => {
    console.log(event);
    setOfficialLevel(event);
  };

  const handleGymChange = (event) => {
    setGym(event);
  };

  const handleSearch = () => {
    fetch(
      `http://localhost:8080/api/search?official_level=${officialLevel}&gym=${gym}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div id="home-container">
      <Form>
        <Form.Item name="gym" label="岩館">
          <Select placeholder="合作岩館" onChange={handleGymChange} allowClear>
            <Option value="岩館一">攀岩石樂樂合作岩館</Option>
            <Option value="快樂岩館">快樂岩館</Option>
            <Option value="岩壁探險谷">岩壁探險谷</Option>
            <Option value="岩漫天地">岩漫天地</Option>
          </Select>
        </Form.Item>
        <Form.Item name="officialLevel" label="官方等級">
          <Select
            placeholder="VB-V9"
            onChange={handleOfficialLevelChange}
            allowClear
          >
            <Option value="B">VB</Option>
            <Option value="0">V0</Option>
            <Option value="1">V1</Option>
            <Option value="2">V2</Option>
            <Option value="3">V3</Option>
            <Option value="4">V4</Option>
            <Option value="5">V5</Option>
            <Option value="6">V6</Option>
            <Option value="7">V7</Option>
            <Option value="8">V8</Option>
            <Option value="9">V9</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="text"
            htmlType="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Search
          </Button>
        </Form.Item>
      </Form>

      {searchResults.map((result, index) => (
        <Row
          key={index}
          onClick={() => handleResultClick(result.roomNumericId)}
        >
          <Card>
            <Row>
              <div id="home-wall-info">
                <strong>
                  岩牆: {result.gym_id} {result.wall} {result.color}
                </strong>
                <p>官方等級: {result.official_level}</p>
                <p>聊天熱度: {result.roomChatCount}</p>
                <p>Beta影片: {result.videoCount}</p>
                <p>更新時間: {formatDate(result.wallUpdateDate)}</p>
                <p>換線時間: {formatDate(result.wallChangeDate)}</p>
              </div>
              <br></br>
              <div>
                <Image width={250} src={result.wallimage} />
              </div>
            </Row>
          </Card>
        </Row>
      ))}
    </div>
  );
};

export default HomeComponent;

// split
// <p>This is Home</p>

// {/* Display search results */}

// {searchResults.length > 0 && (
//   <div>
//     <h2>Search Results:</h2>
//     <ul>
//       {searchResults.map((result, index) => (
//         <li
//           key={index}
//           onClick={() => handleResultClick(result.roomNumericId)}
//         >
//           <p>Official Level: {result.official_level}</p>
//           <p>Gym ID: {result.gym_id}</p>
//           <p>Wall: {result.wall}</p>
//           <p>Color: {result.color}</p>
//           <p>Room Chat Count: {result.roomChatCount}</p>
//           <p>Video Count: {result.videoCount}</p>
//           <p>Wall update date: {result.wallUpdateDate}</p>
//           <p>Wall change date: {result.wallChangeDate}</p>
//           {/* Display image */}
//           <img
//             src={result.wallimage}
//             alt={`Wall Image for ${result.wall}`}
//             style={{ maxWidth: "30%" }}
//           />
//         </li>
//       ))}
//     </ul>
//   </div>
// )}
