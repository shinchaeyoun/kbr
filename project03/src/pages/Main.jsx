import React from "react";
import Login from "./Login.jsx";
import RegisteredCourses from "../components/AdminSummary/RegisteredCourses";


const Main = (props) => {
  console.log("props", props);

  const isLogin = props.isLogin;
  console.log("here is main page : isLogin", isLogin);

  const onLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_lvl");
    document.location.href = "/main";
  };

  return (
    <div>
      <RegisteredCourses />
    </div>
  );
};

export default Main;
