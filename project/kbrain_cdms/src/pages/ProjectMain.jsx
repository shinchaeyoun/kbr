import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

import NavigationItem from "../components/NavigationItem.jsx";
import ProgressPage from "./ProgressPage.jsx";
import CommonBoard from "./commonBoard.jsx";

const ProjectMain = ({ code }) => {
  const navigate = useNavigate();

  return (
    <>
      <p>code : {code}</p>
      {/* <br />
      <div>
        <NavigationItem label="진행률" path={`progress`} navigate={navigate} />
      </div> */}
      <br />
      <div>
        {/* <CommonBoard /> */}
        <NavigationItem label="공통게시판" path={`board`} navigate={navigate}/>
      </div>
    </>
  );
};

export default ProjectMain;
