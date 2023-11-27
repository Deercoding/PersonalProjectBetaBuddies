import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeComponent = ({ setRoomId }) => {
  const [officialLevel, setOfficialLevel] = useState("");
  const [gym, setGym] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  let navigate = useNavigate();

  const handleResultClick = (roomNumericId) => {
    setRoomId(roomNumericId);
    navigate("/wallroom");
  };

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

  return (
    <div>
      <p>This is Home</p>
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
          <ul>
            {searchResults.map((result, index) => (
              <li
                key={index}
                onClick={() => handleResultClick(result.roomNumericId)}
              >
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
                  style={{ maxWidth: "100%" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
