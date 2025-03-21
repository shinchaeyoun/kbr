import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import "../styles/header.css";

const Header = (props) => {
  const level = props.level;

  const navigate = useNavigate();
  const onLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_lvl");
    document.location.href = "/";
  };

  return (
    <>
      <div className="top">
        ID: {sessionStorage.user_id}, Level: {level}
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
            navigate("/");
          }}
        >
          board
        </div>
      </header>
    </>
  );
};

export default Header;
