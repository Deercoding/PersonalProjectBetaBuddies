import React, { useEffect, useState } from "react";

const GameAddComponent = () => {
  let game_wallrooms_id = localStorage.getItem("choosedImage");
  game_wallrooms_id = game_wallrooms_id.split(",");
  let roomImage = localStorage.getItem("imageInfo");
  roomImage = JSON.parse(roomImage);

  const [adLocation, setAdLocation] = useState([]);
  const [adStatus, setAdStatus] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    long_description: "",
    date_start: "",
    date_end: "",
    game_wallrooms_id: game_wallrooms_id,
    member_count: "",
    game_winners: "",
    game_award: "",
    main_image: "",
    second_image: "",
    ad_location_id: "",
    ad_start_date: "",
    advertise_image: "",
  });

  useEffect(() => {
    handleAdLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataForUpload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataForUpload.append(key, value);
      });

      const response = await fetch("http://localhost:8080/api/game/detail", {
        method: "POST",
        body: formDataForUpload,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Post request successful:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAdLocation = () => {
    fetch(`http://localhost:8080/api/game/adlocation`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAdLocation(data.adLocationInfo || []);
        setAdStatus(data.adStatus || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div>
      {roomImage.length > 0 && (
        <div>
          {roomImage.map((result, index) => {
            return (
              <div>
                <p>Chose Room : {result.wallInfo}</p>
                <img
                  src={result.wallImage}
                  alt={`Wall Image for ${result.wall}`}
                  style={{ maxWidth: "10%" }}
                />
              </div>
            );
          })}
        </div>
      )}
      <p>填寫挑戰賽細節</p>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Short Description:
          <input
            type="text"
            name="short_description"
            value={formData.short_description}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Long Description:
          <input
            type="text"
            name="long_description"
            value={formData.long_description}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Start Date:
          <input
            type="date"
            name="date_start"
            value={formData.date_start}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          End Date:
          <input
            type="date"
            name="date_end"
            value={formData.date_end}
            onChange={handleInputChange}
          />
        </label>

        <br></br>
        <label>
          Member Count:
          <input
            type="text"
            name="member_count"
            value={formData.member_count}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Winners:
          <input
            type="text"
            name="game_winners"
            value={formData.game_winners}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Award:
          <input
            type="text"
            name="game_award"
            value={formData.game_award}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Main Image:
          <input type="file" name="main_image" onChange={handleFileChange} />
        </label>
        <br></br>
        <label>
          Second Image:
          <input type="file" name="second_image" onChange={handleFileChange} />
        </label>
        <br></br>
        <label>
          Ad Location ID:
          <input
            type="text"
            name="ad_location_id"
            value={formData.ad_location_id}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Ad Start Date:
          <input
            type="date"
            name="ad_start_date"
            value={formData.ad_start_date}
            onChange={handleInputChange}
          />
        </label>
        <br></br>
        <label>
          Advertise Image:
          <input
            type="file"
            name="advertise_image"
            onChange={handleFileChange}
          />
        </label>
        <br></br>
        <button type="submit">Submit</button>
      </form>
      {adLocation.length > 0 && (
        <div>
          <h3>Ad Location Information:</h3>
          {adLocation.map((location) => (
            <div key={location.ad_location_id}>
              <p>ID: {location.ad_location_id}</p>
              <p>Location: {location.ad_location}</p>
              <p>Width: {location.ad_width}</p>
              <p>Length: {location.ad_length}</p>
              <p>Time Limit: {location.ad_time_limit}</p>
            </div>
          ))}
        </div>
      )}
      {adStatus.length > 0 && (
        <div>
          <h3>Ad Used Status Information:</h3>
          {adStatus.map((adstat) => (
            <div key={adstat.ad_status_id}>
              <p>ID: {adstat.ad_location_id}</p>
              <p>Start_date: {adstat.start_date}</p>
              <p>End_date: {adstat.end_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameAddComponent;
