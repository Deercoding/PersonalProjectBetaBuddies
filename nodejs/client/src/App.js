import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavComponent from "./components/nav-component.js";
import FootComponent from "./components/footer-component.js";
import HomeComponent from "./components/home-component.js";
import BetaUploadComponent from "./components/betaupload-component.js";
import WallroomComponent from "./components/wallroom-component.js";
import ImageuploadComponent from "./components/imageupload-component.js";
import WalladdtagComponent from "./components/walladdtag-component.js";

function App() {
  return (
    <div>
      <NavComponent />
      <Routes>
        <Route path="/" exact element={<HomeComponent />} />
        <Route path="/betaupload" exact element={<BetaUploadComponent />} />
        <Route path="/wallroom" exact element={<WallroomComponent />} />
        <Route path="/imageupload" exact element={<ImageuploadComponent />} />
        <Route path="/walladdtag" exact element={<WalladdtagComponent />} />
      </Routes>
      <FootComponent />
    </div>
  );
}

export default App;
