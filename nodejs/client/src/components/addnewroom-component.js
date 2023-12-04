import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select, Input, Col } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const AddNewRoomComponent = () => {
  const [gym, setGym] = useState("");
  const [wall, setWall] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const currentDate = new Date();
  const defaultWallUpdateTime = currentDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + 60); //change wall in 2 monthes
  const defaultWallChangeTime = futureDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const [imageFormData, setImageFormData] = useState([]);
  const [storeValue, setStoreValue] = useState("岩館一");
  const [branchValue, setBranchValue] = useState("AB牆");
  const [wallUpdateTime, setWallUpdateTime] = useState(defaultWallUpdateTime);
  const [wallChangeTime, setWallChangeTime] = useState(defaultWallChangeTime);

  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const { Option } = Select;

  const handleGymChange = (event) => {
    setGym(event);
  };

  const handleWallChange = (event) => {
    setWall(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSearch = async () => {
    setIsLoading(true);
    await fetch(
      `http://localhost:8080/api/wallchatroom?wall=${wall}&gym=${gym}`
    )
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setSearchResults(data || []);
        const cloudfrontUrl = "https://d3ebcb0pef2qqe.cloudfront.net/";
        setImageFormData([]);
        searchResults.forEach((searchResult) => {
          const imageProcessed = searchResult.wallimage_original;
          appendImage(imageProcessed);
        });
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
        imageProcessed: imageProcessed,
        color: "",
        officialLevel: "",
        tags: "指力/動態/勾腳",
        keepImage: false,
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
        style={{ width: 200 }}
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

  const handleDropdownChange = (name, value) => {
    if (name === "store") {
      setStoreValue(value);
    } else if (name === "branch") {
      setBranchValue(value);
    }
  };

  const handleColorChange = (index, value) => {
    setImageFormData((prevImageFormData) => {
      const newImageFormData = [...prevImageFormData];
      newImageFormData[index].color = value;
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

  const submitAllImages = () => {
    const formData = imageFormData.map((imageData) => ({
      wallImage: imageData.imageProcessed,
      color: imageData.color,
      officialLevel: imageData.officialLevel,
      tags: imageData.tags.split("/"),
      gym: storeValue,
      wall: branchValue,
      wallUpdateTime: wallUpdateTime,
      wallChangeTime: wallChangeTime,
      keepImage: imageData.keepImage,
      isOriginImage: true,
    }));
    console.log(formData);

    fetch(process.env.REACT_APP_SERVER_URL + "api/wallchatroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
    navigate("/");
  };

  return (
    <div id="outer-gamewall-container">
      <div id="gamewall-container">
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
            <Select placeholder="合作岩館" onChange={handleGymChange}>
              <Option value="岩館一">攀岩石樂樂合作岩館</Option>
              <Option value="快樂岩館">快樂岩館</Option>
              <Option value="岩壁探險谷">岩壁探險谷</Option>
              <Option value="岩漫天地">岩漫天地</Option>
            </Select>
          </Form.Item>
          <Form.Item name="wall" label="牆面">
            <Input
              placeholder="牆面 EX:AB牆,CD牆"
              onChange={handleWallChange}
              rules={[
                {
                  required: true,
                },
              ]}
            ></Input>
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
              <h2>選擇製作聊天室的牆面</h2>
              <Button block type="text" onClick={submitAllImages}>
                送出牆面
              </Button>

              <Card title="請確認牆面基本資訊  ">
                {createDropdownInput(
                  "storeValue",
                  "選擇岩館",
                  [
                    {
                      key: "岩館一",
                      value: "岩館一",
                      label: "攀岩石樂樂合作岩館",
                    },
                    { key: "快樂岩館", value: "快樂岩館", label: "快樂岩館" },
                    {
                      key: "岩壁探險谷",
                      value: "岩壁探險谷",
                      label: "岩壁探險谷",
                    },
                    { key: "岩漫天地", value: "岩漫天地", label: "岩漫天地" },
                  ],
                  storeValue,
                  (e) => {
                    handleDropdownChange("store", e.target.value);
                  }
                )}
                {createDropdownInput(
                  "branch",
                  "選擇牆面",
                  [
                    { key: "AB牆", value: "AB牆", label: "AB牆" },
                    { key: "CD牆", value: "CD牆", label: "CD牆" },
                    { key: "EF牆", value: "EF牆", label: "EF牆" },
                  ],
                  branchValue,
                  (e) => handleDropdownChange("branch", e.target.value)
                )}

                {/* {createInput(
                  "text",
                  "wallUpdateTime",
                  "Wall Update Time",
                  wallUpdateTime,
                  (e) => setWallUpdateTime(e.target.value),
                  "更新時間"
                )}
                {createInput(
                  "text",
                  "wallChangeTime",
                  "Wall Change Time",
                  wallChangeTime,
                  (e) => setWallChangeTime(e.target.value),
                  "換線時間"
                )} */}
              </Card>
              <br></br>
              <br></br>
              <div>
                {imageFormData.map((imageData, index) => (
                  <Card key={index} title="圖片辨識結果">
                    <Row>
                      <div>
                        {createInput(
                          "text",
                          "color",
                          "Color",
                          imageData.color,
                          (e) => handleColorChange(index, e.target.value),
                          "線路顏色"
                        )}

                        {createDropdownInput(
                          "officialLevel",
                          "官方等級",
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
                          "#tags"
                        )}
                        <label>建立聊天室</label>
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
