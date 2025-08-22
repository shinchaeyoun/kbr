import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import "./App.css";

// pages
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BoardList from "./pages/BoardList.jsx";

import ProjectPage from "./pages/ProjectPage.jsx";
import BoardMain from "./pages/BoardMain.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";
import BoardWrite from "./pages/BoardWrite.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";

import SubjectPage from "./pages/SubjectPage.jsx";
import Schedule from "./pages/Schedule.jsx";

// components
import Footer from "./components/Footer.jsx";
import Pending from "./components/ApprovalPendingScreen.jsx";
import Deleted from "./components/DeletedPage.jsx";


function App(props) {
  const level = props.level;
  const [isLogin, setIsLogin] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLogin(userId !== null && userId !== undefined);
  }, []);

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<BoardList level={level} />} />
        <Route path="/login" element={<Login isLogin={isLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* 권한 페이지 */}
        <Route path="/pending" element={<Pending />} />

        <Route path="/:code" element={<ProjectPage />}>
          {/* 게시판 관련 페이지 */}

          <Route path="board" element={<BoardMain />} /> {/* 공통 게시판 페이지 */}
          <Route path="board/deleted" element={<Deleted />} /> {/* 삭제된 페이지 */}
          {/* 게시판 관련 페이지 */}
          <Route path="board/:idx" element={<BoardDetail />} />
          <Route path="board/write" element={<BoardWrite />} />
          <Route path="board/:idx/reply" element={<BoardWrite />} />
          <Route path="board/:idx/update" element={<BoardWrite />} />

          <Route path="schedule" element={<Schedule />} /> {/* 일정표 페이지 */}
          
          <Route path=":id" element={<SubjectPage />} /> {/* 과목 페이지 */}
          <Route path=":id/progress" element={<ProgressPage />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board" element={<BoardMain />} /> {/* 과목 기타 게시판 페이지 */}
          {/* 게시판 관련 페이지 */}
          <Route path=":id/board/:idx" element={<BoardDetail />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board/write" element={<BoardWrite />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board/:idx/update" element={<BoardWrite />} /> {/* 과목 진행률 페이지 */}
          <Route path=":id/board/:idx/reply" element={<BoardWrite />} /> {/* 과목 진행률 페이지 */}
          
          <Route path=":id/board/deleted" element={<Deleted />} /> {/* 삭제된 페이지 */}
        </Route>
      </Routes>

      <Footer />
      </QueryClientProvider>
    </>
  );
}

export default App;
