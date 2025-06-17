import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// pages
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BoardList from "./pages/BoardList.jsx";

import ProjectPage from "./pages/ProjectPage.jsx";
import CommonBoard from "./pages/commonBoard.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";
import BoardWrite from "./pages/BoardWrite.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import Page3 from "./pages/Page3.jsx";
import Page4 from "./pages/Page4.jsx";
import SubjectPage from "./pages/SubjectPage.jsx";

import SbBoard from "./pages/SbBoard.jsx";
import EtcBoard from "./pages/EtcBoard.jsx";

// components
import Footer from "./components/Footer.jsx";
import Pending from "./components/ApprovalPendingScreen.jsx";


function App(props) {
  const level = props.level;
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLogin(userId !== null && userId !== undefined);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<BoardList level={level} />} />
        <Route path="/login" element={<Login isLogin={isLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* 권한 페이지 */}
        <Route path="/pending" element={<Pending />} />

        <Route path="/:code" element={<ProjectPage />}>
          {/* <Route path="/" element={<ProjectMain />} /> */}
          <Route path="board" element={<CommonBoard />} />
          <Route path="board/:idx" element={<BoardDetail />} />
          <Route path="board/write" element={<BoardWrite />} />
          <Route path="board/edit" element={<BoardWrite />} />
          <Route path="progress" element={<ProgressPage />} /> {/* 진행률 페이지가 필요한가? */}
          <Route path="page3" element={<Page3 />} />
          <Route path="page4" element={<Page4 />} />
          <Route path="subject" element={<SubjectPage />} />
          <Route path="sb" element={<SbBoard />} />
          <Route path="etc" element={<EtcBoard />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
