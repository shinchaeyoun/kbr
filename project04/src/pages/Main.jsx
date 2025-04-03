import React from "react";
import Login from "./Login.jsx";
import RegisteredCourses from "../components/AdminSummary/RegisteredCourses";


const Main = (props) => {
  console.log("props", props);

  const isLogin = props.isLogin;
  console.log("here is main page : isLogin", isLogin);

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
