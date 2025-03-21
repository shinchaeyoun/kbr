import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      {/* <div onClick={()=>{navigate("/")}} >main</div> */}
      <div onClick={()=>{navigate("/login")}} >login</div>
      <div onClick={()=>{navigate("/public")}} >public</div>
      <div onClick={()=>{navigate("/master")}} >master</div>
      <div onClick={()=>{navigate("/admin")}} >admin</div>
      <div onClick={()=>{navigate("/")}} >board</div>
      {/* <Link to="/">main</Link>
      <Link to="/login">login</Link>
      <Link to="/public">public</Link>
      <Link to="/master">master</Link>
      <Link to="/admin">admin</Link>
      <Link to="/board">board</Link> */}
    </header>
  );
};

export default Header;
