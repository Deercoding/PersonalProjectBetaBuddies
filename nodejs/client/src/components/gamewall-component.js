import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GameWallComponent = ({ setRoomId }) => {
  const [officialLevel, setOfficialLevel] = useState("");
  const [gym, setGym] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  let navigate = useNavigate();

  const handleOfficialLevelChange = (event) => {
    setOfficialLevel(event.target.value);
  };

  const handleGymChange = (event) => {
    setGym(event.target.value);
  };

  const handleSearch = () => {
    fetch(
      `http://localhost:8080/api/search?official_level=${officialLevel}&gym=${gym}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCheckboxChange = (index) => {
    setSelectedImages((prevSelectedImages) => {
      const newSelectedImages = [...prevSelectedImages];
      newSelectedImages[index] = !newSelectedImages[index];
      return newSelectedImages;
    });
  };

  const handleAllSubmissions = () => {
    const combinedData = searchResults
      .map((result, index) => ({
        chooseImage: selectedImages[index],
        roomNumericId: result.roomNumericId,
        wallImage: result.wallimage,
        wallInfo: result.gym_id + "_" + result.wall + "_" + result.color,
      }))
      .filter((item) => item.chooseImage)
      .map((result, index) => {
        return {
          wallImage: result.wallImage,
          wallInfo: result.wallInfo,
        };
      });
    const roomIdData = searchResults
      .map((result, index) => ({
        chooseImage: selectedImages[index],
        roomNumericId: result.roomNumericId,
        wallImage: result.wallimage,
      }))
      .filter((item) => item.chooseImage)
      .map((result, index) => result.roomNumericId);
    localStorage.setItem("choosedImage", roomIdData);
    localStorage.setItem("imageInfo", JSON.stringify(combinedData));
    navigate("/gameadd");
  };

  return (
    <div>
      <p>選擇參加挑戰賽的牆面</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <label>
          Official Level:
          <input
            type="text"
            value={officialLevel}
            onChange={handleOfficialLevelChange}
          />
        </label>
        <br />
        <label>
          Gym:
          <input type="text" value={gym} onChange={handleGymChange} />
        </label>
        <br />
        <button type="submit">Search</button>
      </form>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <button onClick={handleAllSubmissions}>Submit Selected Images</button>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <input
                  type="checkbox"
                  id={`chooseImage-${index}`}
                  name={`chooseImage-${index}`}
                  checked={selectedImages[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
                <label htmlFor={`chooseImage-${index}`}>Choose Image</label>

                <p>Official Level: {result.official_level}</p>
                <p>Gym ID: {result.gym_id}</p>
                <p>Wall: {result.wall}</p>
                <p>Color: {result.color}</p>
                <p>Room Chat Count: {result.roomChatCount}</p>
                <p>Video Count: {result.videoCount}</p>
                <p>Wall update date: {result.wallUpdateDate}</p>
                <p>Wall change date: {result.wallChangeDate}</p>
                {/* Display image */}
                <img
                  src={result.wallimage}
                  alt={`Wall Image for ${result.wall}`}
                  style={{ maxWidth: "30%" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameWallComponent;
