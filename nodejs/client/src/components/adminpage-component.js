import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

const AdminPageComponent = () => {
  return (
    <div>
      <Link to="/">
        <Button type="text"></Button>
      </Link>
      <Link to="/">
        <Button type="text">Link Button</Button>
      </Link>
      <Link to="/">
        <Button type="text">Link Button</Button>
      </Link>
    </div>
  );
};

export default UserPageComponent;
