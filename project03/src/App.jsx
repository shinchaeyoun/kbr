import React, { createContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

// pages
import SendTest from "./SendTest";
import Main from "./pages/Main.jsx";
import Public from "./pages/Public.jsx";
import Manager from "./pages/Manager.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BoardList from "./pages/BoardList.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";
import BoardWrite from "./pages/BoardWrite.jsx";
import BoardUpdate from "./pages/BoardUpdate.jsx";

// components
import Header from "./components/Header.jsx";
import PrivatePublicRoute from "./route/PrivatePublicRoute.jsx";
import PrivateManagerRoute from "./route/PrivateManagerRoute.jsx";
import PrivateAdminRoute from "./route/PrivateAdminRoute.jsx";
import UserList from "./components/UserList.jsx";
import UserDetail from "./components/UserDetail.jsx";
import UserMgmt from "./components/UserMgmt.jsx";
import BoardForm from "./components/forms/BoardForm.jsx";

import "./App.css";

export const AppContext = createContext();

function App(props) {
  const level = props.level;
  const [isLogin, setIsLogin] = useState(false);

  const onLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_lvl");
    document.location.href = "/";
  };

  useEffect(() => {
    if (sessionStorage.user_id == null || sessionStorage.user_id == undefined) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  });

  return (
    <>
      <div>
        ID: {sessionStorage.user_id}, Level: {level}
        <button onClick={onLogout}>Logout</button>
      </div>

      <Header />

      <Routes>
        {/* <Route path="/" element={<PrivateEnterRoute />} /> */}
        {/* <Route path="/" element={<Main isLogin={isLogin} isTrue={isLogin} />} /> */}
        <Route path="/" element={<BoardList level={level} />} />
        <Route path="/sendtest" element={<SendTest />} />
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

        {/* 계정관련 */}
        <Route path="/admin/userlist" element={<UserList />} />
        <Route path="/admin/userlist/:idx" element={<UserDetail />} />
        <Route path="/admin/usermgmt" element={<UserMgmt />} />

        <Route path="/boardform" element={<BoardForm />} />

        <Route
          path="/public"
          element={<PrivatePublicRoute level={level} component={<Public />} />}
        />
        <Route
          path="/manager"
          element={
            <PrivateManagerRoute level={level} component={<Manager />} />
          }
        />

        <Route
          path="/admin"
          element={<PrivateAdminRoute level={level} component={<Admin />} />}
        />
      </Routes>
    </>
  );
}

export default App;
