import React, { useState, useEffect } from "react";
import { socket } from "../socketio.js";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select, Input, Col } from "antd";
const { Option } = Select;

const WalladdtagComponent = () => {
  let navigate = useNavigate();

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
  const [isAdmin, setIsAdmin] = useState(false);

  const checkRole = async (authorization) => {
    await fetch(process.env.REACT_APP_SERVER_URL + "api/role", {
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      method: "POST",
    }).then(async (response) => {
      const role = await response.json();
      if (role == "admin") {
        setIsAdmin(true);
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);

    socket.on("connect", () => {
      console.log(`You connect with id ${socket.id}`);
    });

    socket.on("wallcolor", (response) => {
      console.log(response);
      const cloudfrontUrl = "https://d3ebcb0pef2qqe.cloudfront.net/";
      setImageFormData([]);
      response.forEach((imageName) => {
        const imageProcessed = cloudfrontUrl + imageName;
        appendImage(imageProcessed);
      });
    });

    return () => {
      socket.off("connect");
      socket.off("wallcolor");
    };
  }, []);

  const appendImage = (imageProcessed) => {
    const defaultColor = imageProcessed.split("_")[0].split("/").pop();

    setImageFormData((prevImageFormData) => [
      ...prevImageFormData,
      {
        imageProcessed: imageProcessed,
        color: defaultColor,
        officialLevel: "請填入官方等級",
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

  const submitAllImages = async () => {
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
      navigate("/");
    } else {
      const data = await response.json();
      console.log(data);
      sendData(`Error: ${data}`);
    }
  };
  function sendData(result) {
    document.getElementById("server").innerHTML = JSON.stringify(result);
  }

  return (
    <div id="outer-walladdtag-image-container">
      {!isAdmin ? (
        <p>Authorization...</p>
      ) : (
        <div id="walladdtag-image-container">
          <br></br>
          <p id="server"></p>
          <Card title="牆面基本資訊">
            {createDropdownInput(
              "storeValue",
              "選擇岩館",
              [
                { key: "岩館一", value: "岩館一", label: "攀岩石樂樂合作岩館" },
                { key: "快樂岩館", value: "快樂岩館", label: "快樂岩館" },
                { key: "岩壁探險谷", value: "岩壁探險谷", label: "岩壁探險谷" },
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

            {createInput(
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
            )}
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
                      (e) => handleOfficialLevelChange(index, e.target.value)
                    )}
                    {createInput(
                      "text",
                      "tags",
                      "Tags",
                      imageData.tags,
                      (e) => handleTagsChange(index, e.target.value),
                      "#tags"
                    )}
                    <label>保留圖片</label>
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

          <Button type="text" onClick={submitAllImages}>
            Submit All Images
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalladdtagComponent;
