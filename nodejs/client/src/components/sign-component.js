import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Input, Button } from "antd";

const SignComponent = ({}) => {
  console.log("Signin page");
  let navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  const checkRole = async (authorization) => {
    await fetch(process.env.REACT_APP_SERVER_URL + "api/role", {
      headers: {
        "content-type": "application/json",
        Authorization: authorization,
      },
      method: "POST",
    }).then(async (response) => {
      const role = await response.json();
      if (role == "admin" || role == "user") {
        setIsLogin(true);
      }
    });
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);
  }, []);

  function signin() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    postData(process.env.REACT_APP_SERVER_URL + "api/sign/signin", {
      email: email,
      password: password,
    })
      .then((response) => {
        if (response.data) {
          localStorage.setItem(
            "Authorization",
            "Bearer " + response.data.access_token
          );
          localStorage.setItem("userInfo", [
            response.data.user.id,
            response.data.user.name,
          ]);
          navigate("/");
        } else {
          sendData(response);
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(typeof err);
        sendData(err);
      });
  }

  function signup() {
    let username = document.getElementById("signup-username").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    postData(process.env.REACT_APP_SERVER_URL + "api/sign/signup", {
      name: username,
      email: email,
      password: password,
    })
      .then((response) => {
        if (response.data) {
          localStorage.setItem(
            "Authorization",
            "Bearer " + response.data.access_token
          );
          localStorage.setItem("userInfo", [
            response.data.user.id,
            response.data.user.name,
          ]);

          navigate("/");
        } else {
          sendData(response);
        }
      })
      .catch((err) => {
        console.log(err);
        sendData(err);
      });
  }
  function logout() {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("userInfo");
    setIsLogin(false);
  }

  function sendData(result) {
    document.getElementById("server").innerHTML = JSON.stringify(result);
  }

  async function postData(url, data) {
    return await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());
  }

  return (
    <Col gutter={16} justify="center" align="middle">
      {isLogin ? (
        <Button type="text" onClick={logout}>
          登出
        </Button>
      ) : (
        <div>
          <div id="server"></div>
          <Card span={8} id="sign">
            <div className="sign-container">
              <div className="sign-form-container">
                <h1>註冊</h1>
                <div className="mb-3">
                  <label htmlFor="signup-username">使用者名稱</label>
                  <Input id="signup-username" />
                </div>

                <div className="mb-3">
                  <label htmlFor="signup-email">Email</label>
                  <Input type="email" id="signup-email" />
                </div>

                <div className="mb-3">
                  <label htmlFor="signup-password">密碼</label>
                  <Input.Password id="signup-password" />
                </div>
                <br></br>
                <Button type="text" onClick={signup}>
                  送出
                </Button>
              </div>
            </div>
          </Card>
          <br></br>
          <br></br>
          <Card id="sign">
            <div className="sign-form-container">
              <h1>登入</h1>

              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <Input type="email" id="email" />
              </div>

              <div className="mb-3">
                <label htmlFor="password">密碼</label>
                <Input.Password id="password" />
              </div>
              <br></br>

              <Button type="text" onClick={signin}>
                送出
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Col>
  );
};

export default SignComponent;
