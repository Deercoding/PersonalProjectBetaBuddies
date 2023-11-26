import React, { useState, useEffect } from "react";
import { socket } from "../socketio.js";

const WalladdtagComponent = () => {
  const [imageFormData, setImageFormData] = useState([]);
  const [storeValue, setStoreValue] = useState("岩館一");
  const [branchValue, setBranchValue] = useState("AB牆");

  useEffect(() => {
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
        officialLevel: "",
        tags: "指力/動態/勾腳",
        keepImage: false,
      },
    ]);
  };

  const createInput = (type, name, placeholder, value, onChange) => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );

  const createDropdownInput = (name, title, options, value, onChange) => (
    <div>
      <label>{title}</label>
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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

  const submitAllImages = () => {
    const formData = imageFormData.map((imageData) => ({
      wallImage: imageData.imageProcessed,
      color: imageData.color,
      officialLevel: imageData.officialLevel,
      tags: imageData.tags.split("/"),
      gym: storeValue,
      wall: branchValue,
      keepImage: imageData.keepImage,
    }));
    console.log(formData);

    fetch(process.env.REACT_APP_SERVER_URL + "api/wallchatroom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <h3>this page is set up to add tags to images</h3>

      <div>
        {imageFormData.map((imageData, index) => (
          <div key={index} className="image-container">
            <img src={imageData.imageProcessed} alt={`Image ${index}`} />

            {createInput("text", "color", "Color", imageData.color, (e) =>
              handleColorChange(index, e.target.value)
            )}
            {createInput(
              "text",
              "official-level",
              "Official Level",
              imageData.officialLevel,
              (e) => handleOfficialLevelChange(index, e.target.value)
            )}
            {createInput("text", "tags", "Tags", imageData.tags, (e) =>
              handleTagsChange(index, e.target.value)
            )}
            <label>Keep Image</label>
            <input
              type="checkbox"
              name="keep-image"
              checked={imageData.keepImage}
              onChange={(e) => handleKeepImageChange(index, e.target.checked)}
            />
          </div>
        ))}
      </div>

      {createDropdownInput(
        "store",
        "Store",
        ["岩館一", "store2", "store3"],
        storeValue,
        (e) => {
          handleDropdownChange("store", e.target.value);
        }
      )}
      {createDropdownInput(
        "branch",
        "Branch",
        ["AB牆", "CD牆", "branch3"],
        branchValue,
        (e) => handleDropdownChange("branch", e.target.value)
      )}

      <button type="button" onClick={submitAllImages}>
        Submit All Images
      </button>
    </div>
  );
};

export default WalladdtagComponent;
