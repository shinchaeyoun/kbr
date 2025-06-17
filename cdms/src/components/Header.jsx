import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import "../css/header.css";

const Header = (props) => {
  const navigate = useNavigate();

  const level = props.level;
  const onLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_lvl");
    document.location.href = "/";
  };
  return (
    <>
      <div className="top">
        ID: {localStorage.user_id}, Level: {level}
        <button onClick={onLogout}>Logout</button>
      </div>

      <header>
        <div
          onClick={() => {
            navigate("/");
          }}
        >
          main
        </div>
        <div
          onClick={() => {
            navigate("/login");
          }}
        >
          login
        </div>
        <div
          onClick={() => {
            navigate("/public");
          }}
        >
          public
        </div>
        <div
          onClick={() => {
            navigate("/manager");
          }}
        >
          manager
        </div>
        <div
          onClick={() => {
            navigate("/admin");
          }}
        >
          admin
        </div>
        <div
          onClick={() => {
            navigate("/board");
          }}
        >
          board
        </div>
      </header>
    </>
  );
};

export default Header;
