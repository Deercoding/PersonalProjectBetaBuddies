import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/style.css";
import "react-chat-elements/dist/main.css";
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
import MemberComponent from "./components/member-component.js";
import AddNewRoomComponent from "./components/addnewroom-component.js";

function App() {
  return (
    <>
      <NavComponent />
      <div className="app">
        <Routes>
          <Route path="/" exact element={<HomeComponent />} />
          <Route
            path="/betaupload/:roomId"
            exact
            element={<BetaUploadComponent />}
          />
          <Route
            path="/wallroom/:roomId"
            exact
            element={<WallroomComponent />}
          />
          <Route path="/imageupload" exact element={<ImageuploadComponent />} />
          <Route path="/walladdtag" exact element={<WalladdtagComponent />} />
          <Route path="/sign" exact element={<SignComponent />} />
          <Route path="/gamewall" exact element={<GameWallComponent />} />
          <Route path="/gameadd" exact element={<GameAddComponent />} />
          <Route path="/gamelist" exact element={<GameListComponent />} />
          <Route
            path="/gamedetail/:gameId"
            exact
            element={<GameDetailComponent />}
          />
          <Route path="/member" exact element={<MemberComponent />} />
          <Route path="/addnewroom" exact element={<AddNewRoomComponent />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
