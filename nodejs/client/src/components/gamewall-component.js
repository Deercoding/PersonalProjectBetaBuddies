import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const GameWallComponent = () => {
  const [officialLevel, setOfficialLevel] = useState("");
  const [gym, setGym] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let navigate = useNavigate();
  const { Option } = Select;

  const handleOfficialLevelChange = (event) => {
    setOfficialLevel(event);
  };

  const handleGymChange = (event) => {
    setGym(event);
  };

  const checkRole = async (authorization) => {
    await fetch(process.env.REACT_APP_SERVER_URL + "api/role", {
      headers: {
        "content-type": "application/json",
        authorization: authorization,
      },
      method: "POST",
    }).then(async (response) => {
      const role = await response.json();
      console.log(role);
      if (role == "admin") {
        setIsAdmin(true);
        console.log(isAdmin);
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);
  }, [isAdmin]);

  const handleSearch = async () => {
    setIsLoading(true);
    await fetch(
      `${process.env.REACT_APP_SERVER_URL}api/search?official_level=${officialLevel}&gym=${gym}&searchtags=`
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

  const handleCheckboxChange = (index) => {
    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = [...prevSelectedImages];
      newSelectedImages[index] = !newSelectedImages[index];
      return newSelectedImages;
    });
  };

  const handleAllSubmissions = () => {
    const combinedData = searchResults
      .map((result, index) => ({
        chooseImage: selectedImages[index],
        roomNumericId: result.roomNumericId,
        wallImage: result.wallimage,
        wallInfo: result.gym_id + "_" + result.wall + "_" + result.color,
      }))
      .filter((item) => item.chooseImage)
      .map((result, index) => {
        return {
          wallImage: result.wallImage,
          wallInfo: result.wallInfo,
        };
      });
    const roomIdData = searchResults
      .map((result, index) => ({
        chooseImage: selectedImages[index],
        roomNumericId: result.roomNumericId,
        wallImage: result.wallimage,
      }))
      .filter((item) => item.chooseImage)
      .map((result, index) => result.roomNumericId);
    localStorage.setItem("choosedImage", roomIdData);
    localStorage.setItem("imageInfo", JSON.stringify(combinedData));
    navigate("/gameadd");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div id="outer-gamewall-container">
      {!isAdmin ? (
        <p>Authorization...</p>
      ) : (
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
                <Button block type="text" onClick={handleAllSubmissions}>
                  送出牆面
                </Button>
                <div>
                  {searchResults.map((result, index) => (
                    <Card key={index} title="選擇牆面">
                      <div id="gamewall-wall-container">
                        <div>
                          <input
                            type="checkbox"
                            id={`chooseImage-${index}`}
                            name={`chooseImage-${index}`}
                            checked={selectedImages[index]}
                            onChange={() => handleCheckboxChange(index)}
                          />
                          <label
                            id="gamewall-choose-image"
                            htmlFor={`chooseImage-${index}`}
                          >
                            選擇
                          </label>
                        </div>
                        <div>
                          <p>
                            岩牆: {result.gym_id} {result.wall} {result.color}
                          </p>
                          <p>官方等級: {result.official_level}</p>
                          <p>聊天熱度: {result.roomChatCount}</p>
                          <p>Beta影片: {result.videoCount}</p>
                          <p>更新時間: {formatDate(result.wallUpdateDate)}</p>
                          <p>換線時間: {formatDate(result.wallChangeDate)}</p>
                        </div>
                        <Image
                          src={result.wallimage}
                          alt={`Wall Image for ${result.wall}`}
                          width={250}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default GameWallComponent;
