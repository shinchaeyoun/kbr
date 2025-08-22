import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import App from "../App.jsx";
import Header from "../components/Header.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";

const PrivateEnterRoute = () => {
  const level = localStorage.level || null;
  const [showSignup, setShowSignup] = useState(false);

  let content;
  
  if (level == null) {
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