import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Row } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { LoadingOutlined } from "@ant-design/icons";

const MemberComponent = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboard, setDashboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "成效統計",
        font: {
          size: 14,
        },
      },
    },
  };

  const pieOptions = {
    plugins: {
      title: {
        display: true,
        text: "參賽者分布",
        font: {
          size: 14,
        },
      },
    },
  };

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
      }
    });
  };

  const getDashboard = async (creator) => {
    setIsLoading(true);
    const data = await fetch(
      process.env.REACT_APP_SERVER_URL + "api/dashboard?creator=" + creator
    );
    const dataJson = await data.json();
    setDashboard(dataJson);
    console.log(dataJson);
    setIsLoading(false);
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      let creator = userInfo.split(",")[0];
      getDashboard(creator);
    }
  }, []);

  return (
    <div id="outer-member-container">
      <div id="member-container">
        {!isAdmin ? (
          <Card title="我的主頁" style={{ textAlign: "center" }}>
            <p></p>
            <Link to="/addnewroom">
              <Button block type="text">
                新增聊天室
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <Card title="岩館老闆專屬主頁" style={{ textAlign: "center" }}>
              <div id="member-admin-links">
                <Link to="/gamewall">
                  <Button block type="text">
                    新增挑戰賽
                  </Button>
                </Link>
                <Link to="/imageupload">
                  <Button block type="text">
                    上傳多條線路聊天室
                  </Button>
                </Link>
                <Link to="/addnewroom">
                  <Button block type="text">
                    新增聊天室
                  </Button>
                </Link>
              </div>
            </Card>
            <br></br>

            <h3 id="dashboard-name">挑戰比賽報表</h3>

            {isLoading ? (
              <p>
                Generating Dashboard <LoadingOutlined />
              </p>
            ) : (
              dashboard?.map((result, index) => (
                <>
                  {" "}
                  <br></br>
                  <Card
                    title={"挑戰賽序號:   " + result.game.game_id}
                    type="inner"
                  >
                    <Row id="upper-chart">
                      <Card id="upper-card">
                        <p>挑戰賽名稱: {result.game.name}</p>
                        <p>挑戰開始: {result.game.date_start?.split("T")[0]}</p>
                        <p>挑戰結束: {result.game.date_end?.split("T")[0]}</p>
                        <p>
                          廣告開始: {result.game.ad_start_date?.split("T")[0]}
                        </p>
                        <p>廣告投放天數: {result.game.ad_time_limit + "天"}</p>
                        <Link to={"/gamedetail/" + result.game.game_id}>
                          觀看比賽頁面
                        </Link>
                      </Card>
                      <div id="pie-chart">
                        <Pie data={result.pieChartData} options={pieOptions} />
                      </div>
                    </Row>
                    <Line options={options} data={result.clicks} />
                  </Card>
                </>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MemberComponent;
