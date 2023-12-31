import React from "react";
import { Breadcrumb, Col, Row } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  TrophyOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

const NavComponent = () => {
  let navigate = useNavigate();
  function logoClick() {
    navigate("/");
  }

  return (
    <div id="nav-container">
      <img height={80} src={logo} onClick={() => logoClick()}></img>
      <Breadcrumb
        id="nav"
        items={[
          {
            href: "/gamelist",
            title: (
              <>
                <TrophyOutlined />
                <span>挑戰比賽</span>
              </>
            ),
          },
          {
            href: "/",
            title: (
              <>
                <HomeOutlined />
                <span>回到首頁</span>
              </>
            ),
          },
          {
            href: "/member",
            title: (
              <>
                <SmileOutlined />
                <span>我的主頁</span>
              </>
            ),
          },
          {
            href: "/sign",
            title: (
              <>
                <UserOutlined />
                <span>會員登入</span>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default NavComponent;
