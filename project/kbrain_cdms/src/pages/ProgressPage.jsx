import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

import NavigationItem from "../components/NavigationItem.jsx";

const ProgressPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavigationItem label="진행률" path={`progress`} navigate={navigate} />
      <div>
        <p>전체진행률</p>
        <p>과정1101 진행률</p>
        <p>과정1102 진행률</p>
        <p>과정명1103 진행률</p>
      </div>
    </>
  );
};

export default ProgressPage;
