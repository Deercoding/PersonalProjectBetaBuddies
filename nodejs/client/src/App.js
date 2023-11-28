import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavComponent from "./components/nav-component.js";
import FootComponent from "./components/footer-component.js";
import HomeComponent from "./components/home-component.js";
import BetaUploadComponent from "./components/betaupload-component.js";
import WallroomComponent from "./components/wallroom-component.js";
import ImageuploadComponent from "./components/imageupload-component.js";
import WalladdtagComponent from "./components/walladdtag-component.js";
import SignComponent from "./components/sign-component.js";
import GameWallComponent from "./components/gamewall-component.js";
import GameAddComponent from "./components/gameadd-component.js";
import GameListComponent from "./components/gamelist-component.js";
import GameDetailComponent from "./components/gamedetail-component.js";

function App() {
  const [roomId, setRoomId] = useState("65632fcdd34ccada8196e449");

  return (
    <div>
      <NavComponent />
      <Routes>
        <Route
          path="/"
          exact
          element={<HomeComponent setRoomId={setRoomId} />}
        />
        <Route
          path="/betaupload"
          exact
          element={<BetaUploadComponent roomId={roomId} />}
        />
        <Route
          path="/wallroom"
          exact
          element={<WallroomComponent roomId={roomId} />}
        />
        <Route path="/imageupload" exact element={<ImageuploadComponent />} />
        <Route path="/walladdtag" exact element={<WalladdtagComponent />} />
        <Route path="/sign" exact element={<SignComponent />} />
        <Route path="/gamewall" exact element={<GameWallComponent />} />
        <Route path="/gameadd" exact element={<GameAddComponent />} />
        <Route path="/gamelist" exact element={<GameListComponent />} />
        <Route path="/gamedetail" exact element={<GameDetailComponent />} />
      </Routes>
      <FootComponent />
    </div>
  );
}

export default App;
