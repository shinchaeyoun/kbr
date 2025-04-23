import React from "react";
import Login from "./Login.jsx";
import RegisteredCourses from "../components/AdminSummary/RegisteredCourses";


const Main = (props) => {
  const isLogin = props.isLogin;

  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    document.location.href = "/main";
  };

  return (
    <div>
      <RegisteredCourses />
    </div>
  );
};

export default Main;
