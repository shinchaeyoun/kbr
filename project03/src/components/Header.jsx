import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
// import S from "../styles/GlobalBlock.jsx";

const Header = () => {
  return (
    <header>
     <Link to="/">main</Link>
     <Link to="/login">login</Link>
     <Link to="/public">public</Link>
     <Link to="/master">master</Link>
     <Link to="/admin">admin</Link>
     <Link to="/border">border</Link>
    </header>
  );
};

export default Header;