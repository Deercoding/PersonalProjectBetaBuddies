import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Card, Button, Row, Form, Select, Input, Col } from "antd";
import { Calendar } from "antd";

const GameAddComponent = () => {
  let game_wallrooms_id = localStorage.getItem("choosedImage");
  game_wallrooms_id = game_wallrooms_id.split(",");
  let roomImage = localStorage.getItem("imageInfo");
  roomImage = JSON.parse(roomImage);
  let navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const [adLocation, setAdLocation] = useState([]);
  const [adStatus, setAdStatus] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    long_description: "",
    date_start: "",
    date_end: "",
    game_wallrooms_id: game_wallrooms_id,
    game_winners: "",
    game_award: "",
    main_image: "",
    second_image: "",
    ad_location_id: "",
    ad_start_date: "",
    advertise_image: "",
    creator: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const checkRole = async (authorization) => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}api/role`, {
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      method: "POST",
    }).then(async (response) => {
      const role = await response.json();
      if (role == "admin") {
        setIsAdmin(true);
        let userInfo = localStorage.getItem("userInfo").split(",");

        setUserId(userInfo[0]);
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);
    handleAdLocation();
  }, []);

  function sendData(result) {
    document.getElementById("server").innerHTML = JSON.stringify(result);
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForUpload = new FormData();

      formData.creator = userId;

      Object.entries(formData).forEach(([key, value]) => {
        formDataForUpload.append(key, value);
      });

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}api/game/detail`,
        {
          method: "POST",
          body: formDataForUpload,
        }
      );

      if (response.ok) {
        navigate("/gamelist");
      } else {
        const data = await response.json();

        sendData(`Error: ${data}`);
      }
    } catch (error) {
      console.log(error);
      sendData("Error: 表單填寫內容有誤");
    }
  };

  const handleAdLocation = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}api/game/adlocation`)
      .then((response) => response.json())
      .then((data) => {
        setAdLocation(data.adLocationInfo || []);
        setAdStatus(data.adStatus || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div id="outer-gameadd-container">
      {!isAdmin ? (
        <p>Authorization...</p>
      ) : (
        <div id="gameadd-container">
          <Card title="填寫挑戰賽細節">
            <p id="server"></p>
            <Form encType="multipart/form-data">
              <Form.Item
                label="比賽名稱"
                name="name"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Item>

              <Form.Item
                label="簡短描述"
                name="short_description"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                />
              </Form.Item>

              <Form.Item
                label="詳細描述"
                name="long_description"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="text"
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="開始日期"
                name="date_start"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="date"
                  name="date_start"
                  value={formData.date_start}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="結束日期"
                name="date_end"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="date"
                  name="date_end"
                  value={formData.date_end}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="獲勝人數"
                name="game_winners"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="text"
                  name="game_winners"
                  value={formData.game_winners}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="精美獎品"
                name="game_award"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="text"
                  name="game_award"
                  value={formData.game_award}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="比賽介紹主照片(21:9)"
                name="main_image"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="file"
                  name="main_image"
                  onChange={handleFileChange}
                  rules={[{ required: true, message: "這是必填項目" }]}
                />
              </Form.Item>
              <Form.Item
                label="比賽介紹副照片(16:10)"
                name="second_image"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="file"
                  name="second_image"
                  onChange={handleFileChange}
                  rules={[{ required: true, message: "這是必填項目" }]}
                />
              </Form.Item>
              <Form.Item
                label="廣告ID"
                name="ad_location_id"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="text"
                  name="ad_location_id"
                  value={formData.ad_location_id}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="廣告開始日期(請避開已預定時間)"
                name="ad_start_date"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="date"
                  name="ad_start_date"
                  value={formData.ad_start_date}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="廣告照片(21:9)"
                name="advertise_image"
                rules={[{ required: true, message: "這是必填項目" }]}
              >
                <Input
                  type="file"
                  name="advertise_image"
                  onChange={handleFileChange}
                />
              </Form.Item>
              <Button block type="text" onClick={(e) => handleSubmit(e)}>
                送出比賽資訊
              </Button>
            </Form>
          </Card>

          {adLocation.length > 0 && (
            <Card title="廣告板位基本資訊">
              <Row>
                {adLocation.map((location) => (
                  <Card key={location.ad_location_id}>
                    <p>廣告ID: {location.ad_location_id}</p>
                    <p>位置描述: {location.ad_location}</p>
                    {/* <p>寬(px): {location.ad_width}</p>
                  <p>長(px): {location.ad_length}</p> */}
                    <p>可預訂天數: {location.ad_time_limit}</p>
                  </Card>
                ))}
              </Row>
            </Card>
          )}

          <Card
            style={{ width: "600px" }}
            title="已被挑戰賽預定的廣告ID 1 (請勿選擇) "
          >
            <Calendar
              fullscreen={false}
              disabledDate={(date) => new Date(date) < Date.now()}
              dateCellRender={(date) => {
                const matchingAd = adStatus.find(
                  (adstat) =>
                    adstat.ad_location_id == "1" &&
                    new Date(date) >= new Date(adstat.start_date) &&
                    new Date(date) <= new Date(adstat.end_date)
                );

                if (matchingAd) {
                  return (
                    <p style={{ color: "red" }}>
                      ID{matchingAd.ad_location_id}
                    </p>
                  );
                }
              }}
            />
          </Card>
          <Card
            style={{ width: "600px" }}
            title="已被挑戰賽預定的廣告ID 2 (請勿選擇) "
          >
            <Calendar
              fullscreen={false}
              disabledDate={(date) => new Date(date) < Date.now()}
              dateCellRender={(date) => {
                const matchingAd = adStatus.find(
                  (adstat) =>
                    adstat.ad_location_id == "2" &&
                    new Date(date) >= new Date(adstat.start_date) &&
                    new Date(date) <= new Date(adstat.end_date)
                );

                if (matchingAd) {
                  return (
                    <p style={{ color: "red" }}>
                      ID{matchingAd.ad_location_id}
                    </p>
                  );
                }
              }}
            />
          </Card>

          <Card title="挑戰賽線路">
            {roomImage.length > 0 && (
              <Row>
                {roomImage.map((result, index) => {
                  return (
                    <Col>
                      <Card title={result.wallInfo}>
                        <Image
                          src={result.wallImage}
                          alt={`Wall Image for ${result.wall}`}
                          width={250}
                        />
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default GameAddComponent;
