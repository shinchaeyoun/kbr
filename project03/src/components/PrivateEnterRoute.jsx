import React, { useState, useEffect } from "react";
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx"; // Signup 페이지 추가
import ApprovalPendingScreen from "./ApprovalPendingScreen.jsx";

const PrivateEnterRoute = () => {
  // level 값 가져오기, 기본값은 0
  const level = sessionStorage.user_lvl || 0;

  // 회원가입 화면 여부를 결정하는 상태
  const [showSignup, setShowSignup] = useState(false);

  console.log("level", level);

  // 1. level이 1이면 승인 대기 화면
  if (level === "1") {
    return <ApprovalPendingScreen />;
  }

  // 2. level이 0일 경우 Login 또는 Signup으로 이동
  // if (level === "0") {
  //   // level이 0일 때 로그인 페이지 기본 표시, 회원가입 페이지로 이동 가능
  //   return showSignup ? (
  //     <Signup />
  //   ) : (
  //     <Login onSignupClick={() => setShowSignup(true)} />
  //   );
  // };

  return level >= 2 ? (
    <>
      PrivateEnterRoute page App
      <App level={level} />
    </>
  ) : (
    <>
      PrivateEnterRoute page Login
      <Login />
    </>
  );

  // if (level >= 2) {
  //   return (
  //     <>
  //       PrivateEnterRoute page App
  //       <App level={level} />
  //     </>
  //   );
  // } else {
  //   return level <= 0 ? (
  //     <>
  //       PrivateEnterRoute page Login
  //       <Login onSignupClick={() => {
  //         console.log('setShowSignup(true) click -------');
  //         setShowSignup(true)
          
  //       }} />
  //     </>
  //   ) : (
  //     <>
  //       PrivateEnterRoute page Signup
  //       <Signup />
  //     </>
  //   );
  // }
};

export default PrivateEnterRoute;
