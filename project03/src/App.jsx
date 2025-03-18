import React, { createContext, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

// pages
import SendTest from "./SendTest";
import Main from "./pages/Main.jsx";
import Public from "./pages/Public.jsx";
import Master from "./pages/Master.jsx";
import Admin from "./pages/Admin.jsx";
import BoardList from "./pages/BoardList.jsx";

// components
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import PrivatePublicRoute from "./components/PrivatePublicRoute.jsx";
import PrivateMasterRoute from "./components/PrivateMasterRoute.jsx";
import PrivateAdminRoute from "./components/PrivateAdminRoute.jsx";
import AuthAlert from "./components/AuthAlert.jsx";

import "./App.css";

export const AppContext = createContext();

function App() {
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

  const isAuth = sessionStorage.user_at;

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
    sessionStorage.removeItem("user_at");
    document.location.href = "/";
  };

  return (
    <>
      <button onClick={authorityTest}>authorityTest</button>
      <br />

      <Routes>
        <Route path="/" element={<Main isLogin={isLogin} isTrue={isLogin} />} />
        <Route path="/sendtest" element={<SendTest />} />
        <Route path="/login" element={<Login isLogin={isLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/border" element={<BoardList />} />

        <Route
          path="/public"
          element={
            <PrivatePublicRoute authenticated={isAuth} component={<Public />} />
          }
        />
        <Route
          path="/master"
          element={
            <PrivateMasterRoute authenticated={isAuth} component={<Master />} />
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateAdminRoute authenticated={isAuth} component={<Admin />} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
