import React, { useState, useEffect } from "react";
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import ApprovalPendingScreen from "./ApprovalPendingScreen.jsx";

const PrivateEnterRoute = () => {
  const level = Number(sessionStorage.user_lvl) || 0;
  const [showSignup, setShowSignup] = useState(false);

  console.log("level", level);

  // 1. level이 1이면 승인 대기 화면 표시
  if (level === 1) {
    return <ApprovalPendingScreen />;
  }

  // 2. level이 1보다 작거나 0일 경우 Login 또는 Signup으로만 이동 가능
  if (level < 1) {
    return showSignup ? (
      <Signup />
    ) : (
      <Login onSignupClick={() => setShowSignup(true)} />
    );
  }

  // return level >= 2 ? <App level={level} /> : <Login />;
  
  // 3. level이 2 이상일 경우 App으로 이동
  return <App level={level} />;
};

export default PrivateEnterRoute;
