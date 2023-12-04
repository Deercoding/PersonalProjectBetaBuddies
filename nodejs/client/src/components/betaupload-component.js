import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input } from "antd";

const BetaUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [comments, setComments] = useState("");
  const [levelByAuthor, setLevelByAuthor] = useState("");
  const [tags, setTags] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState(null);
  let navigate = useNavigate();
  const { roomId } = useParams();

  const roomNumericId = roomId;
  const jwtToken = localStorage.getItem("Authorization");
  const userinfo = localStorage.getItem("userInfo").split(",");
  const userId = userinfo[0];
  const userName = userinfo[1];

  const handleFileChange = (event) => {
    const maxSize = 30 * 1024 * 1024; // 30MB in bytes
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (selectedFile.type !== "video/mp4") {
        setError(
          "Invalid file type. Please select a valid video file (MP4 only)."
        );
        setFile(null);
        setVideoPreview(null);
        return;
      }
      if (selectedFile.size > maxSize) {
        setError("File size exceeds the maximum allowed size (10MB).");
        setFile(null);
        setVideoPreview(null);
        return;
      }
      setFile(selectedFile);
      setVideoPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleCommentsChange = (event) => {
    setComments(event.target.value);
  };

  const handleLevelByAuthorChange = (event) => {
    setLevelByAuthor(event.target.value);
  };

  const handleTagsChange = (event) => {
    const tagsArray = event.target.value.split("/");
    setTags(tagsArray.map((tag) => tag.trim()));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!file) {
        setError("Please select a video file.");
        return;
      }

      const formData = new FormData();
      formData.append("roomNumericId", roomNumericId);
      formData.append("userId", userId);
      formData.append("userName", userName);
      formData.append("video", file);
      formData.append("comments", comments);
      formData.append("levelByAuthor", levelByAuthor);
      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });

      // Send a POST request to the backend
      const response = await fetch("http://localhost:8080/api/beta", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log(response.json());
        navigate("/");
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setFile(null);
    setVideoPreview(null);
    setComments("");
    setLevelByAuthor("");
    setTags([""]);
  };

  return (
    <div id="outside-video-upload-container">
      <Card id="video-upload-container" title="分享Beta區">
        <br></br>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <strong>上傳Beta影片:</strong>
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          style={{
            // Add your styles here
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginTop: "5px",
          }}
        />
        <br></br>
        <div>
          {videoPreview && (
            <video width="180" controls>
              <source src={videoPreview} type="video/mp4" />
            </video>
          )}
        </div>

        <label>
          Comments:
          <Input type="text" value={comments} onChange={handleCommentsChange} />
        </label>

        <label>
          體感等級:
          <Input
            type="text"
            value={levelByAuthor}
            onChange={handleLevelByAuthorChange}
          />
        </label>

        <label>
          #tags (EX: 指力/動態) :
          <Input
            type="text"
            value={tags.join("/")}
            onChange={handleTagsChange}
          />
        </label>

        <Button type="text" onClick={(e) => handleSubmit(e)}>
          Upload
        </Button>
      </Card>
    </div>
  );
};

export default BetaUploadComponent;
