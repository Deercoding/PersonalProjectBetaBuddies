// export default ImageUploadComponent;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "antd";

const ImageuploadComponent = () => {
  const [fileList, setFileList] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  let navigate = useNavigate();
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
      console.log(role);
      if (role == "admin") {
        setIsAdmin(true);
        console.log(isAdmin);
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const authorization = localStorage.getItem("Authorization");
    checkRole(authorization);
  }, []);

  const updateList = (event) => {
    const input = event.target;
    const newFileList = [];
    const newImagePreviews = [];

    for (let i = 0; i < input.files.length; ++i) {
      newFileList.push(input.files.item(i).name);
      const reader = new FileReader();
      reader.onload = function (e) {
        newImagePreviews.push(e.target.result);
        setImagePreviews([...newImagePreviews]); // Update image previews state
      };
      reader.readAsDataURL(input.files[i]);
    }

    setFileList(newFileList);
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Image upload</title>
      </head>
      <body>
        <div id="outside-video-upload-container">
          <Card id="video-upload-container" title="上傳圖像辨識的圖片">
            <form
              action="https://deercodeweb.com/api/wallupload"
              method="post"
              encType="multipart/form-data"
            >
              <label htmlFor="file">上傳一張岩牆圖片: </label>
              <Input
                id="file"
                type="file"
                name="file"
                onChange={updateList}
                required
              />

              <br />
              <div id="preview">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{ maxWidth: "200px", marginRight: "10px" }}
                  />
                ))}
              </div>
              <br />
              <button
                type="submit"
                style={{
                  backgroundColor: "#e74c3c",
                  color: "#ffffff",
                  borderColor: "#ffffff",
                  borderRadius: "8px",
                  padding: "7px 20px",
                }}
              >
                Send
              </button>
            </form>
          </Card>
        </div>

        <div id="header"></div>
      </body>
    </html>
  );
};

export default ImageuploadComponent;
