import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import App from "../App.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import ApprovalPendingScreen from "../components/ApprovalPendingScreen.jsx";

const PrivateEnterRoute = () => {
  const level = Number(sessionStorage.user_lvl) || 0;
  const [showSignup, setShowSignup] = useState(false);

  if (level < 1) {
    return showSignup ? (
      <>
        <Navigate to="/signup" />
        <Signup setShowSignup={setShowSignup} />
      </>
    ) : (
      <>
        <Navigate to="/login" />
        <Login onSignupClick={() => setShowSignup(true)} />
      </>
    );
  } else if (level === 1) {
    return <ApprovalPendingScreen />;
  }

  return <App level={level} />;
};

export default PrivateEnterRoute;
