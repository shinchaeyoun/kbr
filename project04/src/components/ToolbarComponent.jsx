import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";

import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import C from "../styled/CalenderStyle.jsx";
import axios from "axios";

const localizer = momentLocalizer(moment);

const ToolbarComponent = (props) => {
  const [isView, setIsView] = useState('month');
  const { date } = props;

  const navigate = (action) => {
    props.onNavigate(action);
  };

  const onViews = (action) => {
    props.onView(action);
    setIsView(action);
  };


  const view = ['month', 'week', 'day', 'agenda'];
  const week = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <C.ToolbarComponent>
      <C.Group>
        <C.Button onClick={navigate.bind(null, "TODAY")}>Today</C.Button>
        <C.Button onClick={navigate.bind(null, "PREV")}>Back</C.Button>
        <C.Button onClick={navigate.bind(null, "NEXT")}>Next</C.Button>
      </C.Group>
      <C.Group>
        {props.view === "month" &&
          `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
        {props.view === "week" &&
          `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
        {props.view === "day" &&
          `${date.getMonth() + 1}월 ${date.getDate()}일 ${
            week[date.getDay()]
          }요일`}
      </C.Group>
      <C.Group>
        {view.map((item, idx) => {
          return (
            <C.Button
              key={idx}
              onClick={onViews.bind(null, item)}
              className={isView === item ? "active" : ""}
            >
              {item}
            </C.Button>
          );
        })}
      </C.Group>
    </C.ToolbarComponent>
  );
};

export default ToolbarComponent;
