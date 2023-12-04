import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "antd";

const MemberComponent = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const checkRole = async (authorization) => {
    await fetch("http://localhost:8080/api/role", {
      headers: {
        "content-type": "application/json",
        authorization: authorization,
      },
      method: "POST",
    }).then(async (response) => {
      const role = await response.json();
      if (role == "admin") {
        setIsAdmin(true);
      }
    });
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);
  }, []);

  return (
    <div id="outer-member-container">
      <div id="member-container">
        {!isAdmin ? (
          <Card title="我的主頁" style={{ textAlign: "center" }}>
            <p></p>
            <Link to="/">
              <Button block type="text">
                新增聊天室
              </Button>
            </Link>
          </Card>
        ) : (
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
              <Link to="/">
                <Button block type="text">
                  新增聊天室
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberComponent;
