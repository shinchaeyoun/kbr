import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// pages
// import Main from "./pages/Main.jsx";
import Admin from "./pages/Admin.jsx";
import Manager from "./pages/Manager.jsx";
import Public from "./pages/Public.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BoardList from "./pages/BoardList.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";
import UserList from "./pages/UserList.jsx";
import UserDetail from "./pages/UserDetail.jsx";

// components
import Header from "./components/Header.jsx";
import BoardForm from "./components/forms/BoardForm.jsx";

// route
import PrivatePublicRoute from "./route/PrivatePublicRoute.jsx";
import PrivateManagerRoute from "./route/PrivateManagerRoute.jsx";
import PrivateAdminRoute from "./route/PrivateAdminRoute.jsx";

function App(props) {
  const level = props.level;
  const [isLogin, setIsLogin] = useState(false);
  
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLogin(userId !== null && userId !== undefined);
  }, []);

  return (
    <>
      <Header level={level} />

      <Routes>
        {/* <Route path="/sendtest" element={<SendTest />} /> */}
        <Route path="/" element={<BoardList level={level} />} />
        <Route path="/login" element={<Login isLogin={isLogin} />} />
        <Route path="/signup" element={<Signup />} />
        {/* 게시판 관련 */}
        <Route path="/board" element={<BoardList level={level} />} />
        <Route path="/board/:idx" element={<BoardDetail />} />
        <Route path="/board/write" element={<BoardForm isUpdate={false} />} />
        <Route
          path="/board/update/:idx"
          element={<BoardForm isUpdate={true} />}
        />
        {/* 어드민계정관련 */}
        <Route path="/admin/userlist" element={<UserList />} />
        <Route path="/admin/userlist/:idx" element={<UserDetail />} />

        {/* 권한 페이지 */}
        <Route path="/public" element={<PrivatePublicRoute level={level} component={<Public />} />} />
        <Route path="/manager" element={<PrivateManagerRoute level={level} component={<Manager />} />}/>
        <Route path="/admin" element={<PrivateAdminRoute level={level} component={<Admin />} />} />
      </Routes>
    </>
  );
}

export default App;
