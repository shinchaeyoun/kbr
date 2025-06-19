import { useState, useEffect } from "react";
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

import SubjectPage from "./pages/SubjectPage.jsx";
import SubjectBoard from "./pages/SubjectBoard.jsx";
import Schedule from "./pages/Schedule.jsx";

// components
import Footer from "./components/Footer.jsx";
import Pending from "./components/ApprovalPendingScreen.jsx";
import Deleted from "./components/DeletedPage.jsx";


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
          {/* 게시판 관련 페이지 */}

          <Route path="board" element={<CommonBoard />} /> {/* 공통 게시판 페이지 */}
          <Route path="board/deleted" element={<Deleted />} /> {/* 삭제된 페이지 */}
          <Route path="board/:idx" element={<BoardDetail />} />
          <Route path="board/write" element={<BoardWrite />} />
          <Route path="board/:idx/reply" element={<BoardWrite />} />
          <Route path="board/:idx/edit" element={<BoardWrite />} />

          <Route path="schedule" element={<Schedule />} /> {/* 일정표 페이지 */}
          
          <Route path=":id" element={<SubjectPage />} /> {/* 과목 페이지 */}
          <Route path=":id/progress" element={<ProgressPage />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board" element={<SubjectBoard />} /> {/* 과목 기타 게시판 페이지 */}
          <Route path=":id/board/:idx" element={<BoardDetail />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board/:idx/reply" element={<BoardWrite />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board/:idx/edit" element={<BoardWrite />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board/write" element={<BoardWrite />} /> {/* 과목 진행률 페이지 */}
          
          <Route path=":id/board/deleted" element={<Deleted />} /> {/* 삭제된 페이지 */}
        </Route>
      </Routes>

      <Footer />
    </>
  );
}

export default App;
