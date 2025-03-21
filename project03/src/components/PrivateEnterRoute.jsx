import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import ApprovalPendingScreen from "./ApprovalPendingScreen.jsx";

const PrivateEnterRoute = () => {
  const level = Number(sessionStorage.user_lvl) || 0;
  const [showSignup, setShowSignup] = useState(false);

  if (level < 1) {
    return showSignup ? (
      <>
        PrivateEnterRoute navigate to Signup
        <br />
        level : {level}
        <Navigate to="/signup" />
        <Signup setShowSignup={setShowSignup} />
      </>
    ) : (
      <>
        PrivateEnterRoute navigate to login
        <br />
        level : {level}
        <Navigate to="/login" />
        <Login onSignupClick={() => setShowSignup(true)} />
      </>
    );
  } else if (level === 1) {
    return <ApprovalPendingScreen />;
  }

  return (
    <>
      PrivateEnterRoute
      <br />
      level: {level}
      <App level={level} />
    </>
  );
};

export default PrivateEnterRoute;
