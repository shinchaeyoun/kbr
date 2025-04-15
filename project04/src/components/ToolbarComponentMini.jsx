import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import C from "../styled/CalenderStyle.jsx";
import axios from 'axios';

const ToolbarComponentMini = () => {
  const [isView, setIsView] = useState("month");
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  const onViews = (action) => {
    props.onView(action);
    setIsView(action);
  };

  const view = ["month", "week", "day", "agenda"];
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <C.ToolbarComponent>
      {/* <C.Group>{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</C.Group>
      <C.Group>
        <C.Button onClick={navigate.bind(null, "PREV")}>Back</C.Button>
        <C.Button onClick={navigate.bind(null, "NEXT")}>Next</C.Button>
      </C.Group> */}
    </C.ToolbarComponent>
  );
};

export default ToolbarComponentMini;