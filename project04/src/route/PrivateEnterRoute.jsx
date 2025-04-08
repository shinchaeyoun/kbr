import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import App from "../App.jsx";
import Header from "../components/Header.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import ApprovalPendingScreen from "../components/ApprovalPendingScreen.jsx";

const PrivateEnterRoute = () => {
  const level = Number(localStorage.level) || 0;
  const [showSignup, setShowSignup] = useState(true);

  let content;

  if (level < 1) {
    content = showSignup ? (
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
    content = (
      <>
        <Navigate to="/pending" />
        <ApprovalPendingScreen />
      </>
    );
  } else {
    content = <App level={level} />;
  }

  return (
    <>
      <Header setShowSignup={setShowSignup} />
      {content}
    </>
  );
};

export default PrivateEnterRoute;