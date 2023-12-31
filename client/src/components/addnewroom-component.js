import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select, Input, Col } from "antd";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";

const AddNewRoomComponent = () => {
  const [gym, setGym] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [imageFormData, setImageFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  let navigate = useNavigate();
  const { Option } = Select;

  let role;

  const checkRole = async (authorization) => {
    await fetch(process.env.REACT_APP_SERVER_URL + "api/role", {
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      method: "POST",
    }).then(async (response) => {
      role = await response.json();
    });

    if (role != "admin" && role != "user") {
      alert("請登入再新增聊天室");
      navigate("/");
    } else {
      let userId = "creator";
      let userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        userId = userInfo.split(",")[0];
      }
      setUserId(userId);
    }
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);
  }, []);

  const handleSearchGymChange = (event) => {
    setGym(event);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    await fetch(
      `${process.env.REACT_APP_SERVER_URL}api/wallchatroom/originalwall?gym=${gym}`
    )
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setSearchResults(data || []);
        setImageFormData([]);
        data.forEach((searchResult) => {
          const imageProcessed = searchResult.wallimage_original;
          appendImage(searchResult);
        });
        setIsSearch(true);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  const appendImage = (imageProcessed) => {
    setImageFormData((prevImageFormData) => [
      ...prevImageFormData,
      {
        gym: imageProcessed.gym_id,
        wall: imageProcessed.wall,
        imageProcessed: imageProcessed.wallimage_original,
        color: "顏色",
        officialLevel: "等級",
        tags: "指力/動態/勾腳",
        keepImage: false,
        wallUpdateTime: new Date(imageProcessed.wall_update_time),
        // .toISOString()
        // .split("T")[0],
        wallChangeTime: new Date(imageProcessed.wall_change_time),
        // .toISOString()
        // .split("T")[0],
        creator: userId,
      },
    ]);
  };

  const createInput = (type, name, placeholder, value, onChange, label) => (
    <Row align="middle">
      <Col>
        <label>{label}</label>
      </Col>
      <Col>
        <Input
          style={{ width: 180 }}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </Col>
    </Row>
  );

  const createDropdownInput = (name, title, options, value, onChange) => (
    <div>
      <label>{title}</label>
      <Select
        style={{ width: 180 }}
        name={name}
        value={value}
        onChange={(newValue) => onChange({ target: { value: newValue } })}
      >
        {options.map(({ key, value, label }) => (
          <Option key={key} value={value}>
            {label}
          </Option>
        ))}
      </Select>
    </div>
  );

  const handleColorChange = (index, value) => {
    setImageFormData((prevImageFormData) => {
      const newImageFormData = [...prevImageFormData];
      newImageFormData[index].color = value;
      return newImageFormData;
    });
  };

  const handleGymChange = (index, value) => {
    setImageFormData((prevImageFormData) => {
      const newImageFormData = [...prevImageFormData];
      newImageFormData[index].gym = value;
      return newImageFormData;
    });
  };

  const handleWallChange = (index, value) => {
    setImageFormData((prevImageFormData) => {
      const newImageFormData = [...prevImageFormData];
      newImageFormData[index].wall = value;
      return newImageFormData;
    });
  };

  const handleOfficialLevelChange = (index, value) => {
    setImageFormData((prevImageFormData) => {
      const newImageFormData = [...prevImageFormData];
      newImageFormData[index].officialLevel = value;
      return newImageFormData;
    });
  };

  const handleTagsChange = (index, value) => {
    setImageFormData((prevImageFormData) => {
      const newImageFormData = [...prevImageFormData];
      newImageFormData[index].tags = value;
      return newImageFormData;
    });
  };

  const handleKeepImageChange = (index, checked) => {
    setImageFormData((prevImageFormData) => {
      const newImageFormData = [...prevImageFormData];
      newImageFormData[index].keepImage = checked;
      return newImageFormData;
    });
  };

  const submitAllImages = async () => {
    const formData = imageFormData.map((imageData) => ({
      wallImage: imageData.imageProcessed,
      color: imageData.color,
      officialLevel: imageData.officialLevel,
      tags: imageData.tags.split("/"),
      gym: imageData.gym,
      wall: imageData.wall,
      wallUpdateTime: imageData.wallUpdateTime,
      wallChangeTime: imageData.wallChangeTime,
      keepImage: imageData.keepImage,
      isOriginImage: false,
      creator: userId,
    }));
    console.log(formData);

    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER_URL + "api/wallchatroom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("聊天室已新增成功, 請回到首頁搜尋聊天室");
        navigate("/");
      } else {
        const data = await response.json();

        sendData(`${data}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  function sendData(result) {
    document.getElementById("server").innerHTML = JSON.stringify(result);
  }

  return (
    <div id="outer-gamewall-container">
      <div id="gamewall-container">
        <p id="server"></p>
        <Form id="gamewall-form">
          <Form.Item
            name="gym"
            label="岩館"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="合作岩館" onChange={handleSearchGymChange}>
              <Option value="攀岩石樂樂合作岩館">攀岩石樂樂合作岩館</Option>
              <Option value="快樂岩館">快樂岩館</Option>
              <Option value="岩壁探險谷">岩壁探險谷</Option>
              <Option value="岩漫天地">岩漫天地</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="text"
              htmlType="submit"
              onClick={(e) => handleSearch(e)}
            >
              Search
            </Button>
          </Form.Item>
        </Form>
        {isLoading ? (
          <p>
            尋找符合條件的路線 <LoadingOutlined />
          </p>
        ) : isSearch && searchResults && searchResults.length === 0 ? (
          <p>
            <CloseCircleOutlined /> 沒有符合條件的聊天室
          </p>
        ) : (
          searchResults.length > 0 && (
            <div>
              <h2>選擇製作聊天室的牆面</h2>
              <Button block type="text" onClick={submitAllImages}>
                送出牆面
              </Button>

              <br></br>
              <br></br>
              <div>
                {imageFormData.map((imageData, index) => (
                  <Card key={index} title="原始牆面" id="original-wall-card">
                    <Row id="original-wall-card-row">
                      <div>
                        {createInput(
                          "text",
                          "gym",
                          "Gym",
                          imageData.gym,
                          (e) => handleGymChange(index, e.target.value),
                          "岩館:"
                        )}

                        {createInput(
                          "text",
                          "wall",
                          "Wall",
                          imageData.wall,
                          (e) => handleWallChange(index, e.target.value),
                          "牆面:"
                        )}
                        {createInput(
                          "text",
                          "color",
                          "Color",
                          imageData.color,
                          (e) => handleColorChange(index, e.target.value),
                          "顏色:"
                        )}
                        {createDropdownInput(
                          "officialLevel",
                          "等級:",
                          [
                            { key: "B", value: "B", label: "VB" },
                            { key: "0", value: "0", label: "V0" },
                            { key: "1", value: "1", label: "V1" },
                            { key: "2", value: "2", label: "V2" },
                            { key: "3", value: "3", label: "V3" },
                            { key: "4", value: "4", label: "V4" },
                            { key: "5", value: "5", label: "V5" },
                            { key: "6", value: "6", label: "V6" },
                            { key: "7", value: "7", label: "V7" },
                            { key: "8", value: "8", label: "V8" },
                            { key: "9", value: "9", label: "V9" },
                          ],
                          imageData.officialLevel,
                          (e) =>
                            handleOfficialLevelChange(index, e.target.value)
                        )}
                        {createInput(
                          "text",
                          "tags",
                          "Tags",
                          imageData.tags,
                          (e) => handleTagsChange(index, e.target.value),
                          "#tags:"
                        )}

                        <label
                          style={{
                            fontSize: "16px",
                            color: "rgb(213, 52, 35)",
                          }}
                        >
                          確認建立聊天室
                        </label>
                        <input
                          type="checkbox"
                          name="keep-image"
                          checked={imageData.keepImage}
                          onChange={(e) =>
                            handleKeepImageChange(index, e.target.checked)
                          }
                        />
                      </div>
                      <Image src={imageData.imageProcessed} width={250} />
                    </Row>
                  </Card>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AddNewRoomComponent;
