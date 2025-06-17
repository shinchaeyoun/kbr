import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";

import Main from "./pages/Main.jsx";
import ProjectList from "./pages/ProjectList.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import Page1 from "./pages/Page1.jsx";
import Page2 from "./pages/Page2.jsx";
import Page3 from "./pages/Page3.jsx";
import Page4 from "./pages/Page4.jsx";
import Scheduled from "./pages/Scheduled.jsx";

function App() {
  const navigate = useNavigate();

  return (
    <>

      <Routes>
        <Route path="/" element={<ProjectList />} /> {/* 과정 리스트 페이지 */}

        <Route path="/:code" element={<ProjectPage />}>
          <Route path="page1" element={<Page1 />} />
          <Route path="page2" element={<Page2 />} />
          <Route path="page3" element={<Page3 />} />
          <Route path="page4" element={<Page4 />} />
          <Route path="scheduled" element={<Scheduled />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
