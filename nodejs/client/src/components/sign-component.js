import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Input, Button } from "antd";

const SignComponent = ({}) => {
  console.log("Signin page");
  let navigate = useNavigate();

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
    console.log(username, email, password);
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
      <Card span={8} id="sign">
        <div id="server"></div>
        <div className="sign-container">
          <div className="sign-form-container">
            <h1>註冊</h1>
            <div className="mb-3">
              <label htmlFor="signup-username">Username</label>
              <Input id="signup-username" />
            </div>

            <div className="mb-3">
              <label htmlFor="signup-email">Email address</label>
              <Input type="email" id="signup-email" />
            </div>

            <div className="mb-3">
              <label htmlFor="signup-password">Password</label>
              <Input.Password id="signup-password" />
            </div>
            <br></br>
            <Button type="text" onClick={signup}>
              Submit
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
            <label htmlFor="email">Email address</label>
            <Input type="email" id="email" />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <Input.Password id="password" />
          </div>
          <br></br>

          <Button type="text" onClick={signin}>
            Submit
          </Button>
        </div>
      </Card>
    </Col>
  );
};

export default SignComponent;
