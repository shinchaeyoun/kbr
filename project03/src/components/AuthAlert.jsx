import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrap = styled.div`
  align-content: center;
  height: 500px;
  text-align: center;
  font-weight: bold;
`;

const AuthAlert = () => {
  return <Wrap>접근할 수 없는 페이지입니다.</Wrap>;
};

export default AuthAlert;
