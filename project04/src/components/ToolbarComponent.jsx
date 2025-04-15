import React, { useState } from "react";
import C from "../styled/CalenderStyle.jsx";

const ToolbarComponent = ({ viewClass, ...props }) => {
  const [isView, setIsView] = useState('month');
  const view = ['month', 'week', 'day', 'agenda'];
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const { date } = props;

  const navigate = (action) => {
    console.log('props.onNavigate',action);
    
    props.onNavigate(action);
  };
  const onViews = (action) => {
    props.onView(action);
    setIsView(action);
  };

  const Test = () => {
    console.log('date', date);
    console.log('props', props);
    console.log('viewClass', viewClass);
    console.log('navigate.bind(null, "NEXT"),', navigate.bind(null, "NEXT"));
    
  };

  return (
    <C.ToolbarComponent>
      <C.Group>
        <C.Button onClick={navigate.bind(null, "TODAY")}>Today</C.Button>
        <C.Button onClick={navigate.bind(null, "PREV")}>Back</C.Button>
        <C.Button onClick={navigate.bind(null, "NEXT")}>Next</C.Button>
        <C.Button onClick={Test}>test</C.Button>
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
              className={viewClass === item ? "active" : ""}
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
