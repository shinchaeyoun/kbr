import React from "react";
import Login from "./Login.jsx";

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
      <div>
        <h2>Main 페이지</h2>
      </div>

      {isLogin ? <div>Login</div> : <div>Logout</div>}
    </div>
  );
};

export default Main;
