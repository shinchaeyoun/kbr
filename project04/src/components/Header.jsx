import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import "../styled/header.css";

const Header = (props) => {
  const navigate = useNavigate();

  const level = props.level;
  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    document.location.href = "/";
  };
  
  return (
    <>
      <div className="top">
        ID: {localStorage.userId}, Level: {level}
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
