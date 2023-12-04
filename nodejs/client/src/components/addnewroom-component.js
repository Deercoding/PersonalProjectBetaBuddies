import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const AddNewRoomComponent = () => {
  const [officialLevel, setOfficialLevel] = useState("");
  const [gym, setGym] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const { Option } = Select;

  const handleOfficialLevelChange = (event) => {
    setOfficialLevel(event);
  };

  const handleGymChange = (event) => {
    setGym(event);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = async () => {
    setIsLoading(true);
    await fetch(
      `http://localhost:8080/api/search?official_level=${officialLevel}&gym=${gym}&searchtags=`
    )
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setSearchResults(data.data || []);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div id="outer-gamewall-container">
      <div id="gamewall-container">
        <Form id="gamewall-form">
          <Form.Item name="gym" label="岩館">
            <Select
              placeholder="合作岩館"
              onChange={handleGymChange}
              allowClear
            >
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
        {isLoading ? (
          <p>
            Searching <LoadingOutlined />
          </p>
        ) : (
          searchResults.length > 0 && (
            <div>
              <h2>選擇參加挑戰賽的牆面</h2>
              <Button block type="text">
                送出牆面
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AddNewRoomComponent;
