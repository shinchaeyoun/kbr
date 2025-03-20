import React, { createContext, useState, useEffect } from "react";
import { Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import ProtectedRoute from "./ProtectedRoute";
import axios from "axios";

// pages
import SendTest from "./SendTest";
import Main from "./pages/Main.jsx";
import Public from "./pages/Public.jsx";
import Master from "./pages/Master.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import BoardList from "./pages/BoardList.jsx";
import BoardWrite from "./pages/BoardWrite.jsx";
import BoardDetail from "./pages/BoardDetail.jsx";
import BoardUpdate from "./pages/BoardUpdate.jsx";

// components
import Header from "./components/Header.jsx";
import PrivatePublicRoute from "./components/PrivatePublicRoute.jsx";
import PrivateMasterRoute from "./components/PrivateMasterRoute.jsx";
import PrivateAdminRoute from "./components/PrivateAdminRoute.jsx";
import AuthAlert from "./components/AuthAlert.jsx";
import UserInfo from "./components/UserInfo.jsx";

import "./App.css";

export const AppContext = createContext();

function App(props) {
  const level = props.level;
  console.log("app level", level);

  const pageList = [
    "main",
    // "sendtest",
    "login",
    // "signup",
    "public",
    "master",
    "admin",
  ];

  const [isLogin, setIsLogin] = useState(false);

  const isAuth = sessionStorage.user_lvl;

  const authorityTest = () => {
    console.log("authorityTest", isLogin, isAuth);
    // axios
    //   .post("http://localhost:5000/authority", {
    //     auth: isAuth,
    //   })
    //   .then((res) => {})
    //   .catch((err) => {
    //     console.error("err:", err.message);
    //   });
  };

  useEffect(() => {
    if (sessionStorage.user_id == null || sessionStorage.user_id == undefined) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  });

  const onLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_lvl");
    document.location.href = "/";
  };

  const moveToSignup = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };

  return (
    <AuthProvider>
      <div className="userInfo">
        id : {sessionStorage.user_id} level: {level}
        <button onClick={onLogout}>Logout</button>
      </div>
      <br />
      <br />
      <Header />

      {/* <button onClick={authorityTest}>authorityTest</button>
      <br /> */}
      <Router>
        <Routes>
          {/* <Route path="/" element={<PrivateEnterRoute />} /> */}
          {/* <Route path="/" element={<Main isLogin={isLogin} isTrue={isLogin} />} /> */}
          <Route path="/" element={<BoardList level={level} />} />
          <Route path="/sendtest" element={<SendTest />} />
          <Route
            path="/login"
            element={<Login isLogin={isLogin} onSignupClick={moveToSignup} />}
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/board" element={<BoardList level={level} />} />
          <Route path="/write" element={<BoardWrite />} />
          <Route path="/board/:idx" element={<BoardDetail />} />
          <Route path="/update/:idx" element={<BoardUpdate />} />
          <Route path="/userinfo" element={<UserInfo />} />

          <Route
            path="/public"
            element={
              <PrivatePublicRoute level={level} component={<Public />} />
            }
          />
          <Route
            path="/master"
            element={
              <PrivateMasterRoute level={level} component={<Master />} />
            }
          />

          <Route
            path="/admin"
            element={<PrivateAdminRoute level={level} component={<Admin />} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
