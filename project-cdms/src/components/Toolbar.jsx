import React, { useState } from "react";
import styled from "styled-components";
import S from "../styled/GlobalBlock";


const Button = styled(S.Button)`
  font-family: "OutfitRegular", "Pretendard-Regular" !important;
  font-size: 14px;
`;
const Group = styled(S.Group)``;

const ToolbarComponent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;

  ${Group} {
    gap: 0;
    ${Button} {
      height: 30px;
      border-radius: 0;

      color: #373a3c;
      display: inline-block;
      margin: 0;
      text-align: center;
      vertical-align: middle;
      background: none;
      background-image: none;
      border-right: none;
      padding: 6px 16px;
      line-height: normal;
      white-space: nowrap;
      text-transform: capitalize;

      &:focus {
        color: #373a3c;
        background-color: #e6e6e6;
        border-color: #adadad;
      }

      &:hover {
        color: #373a3c;
        cursor: pointer;
        background-color: #e6e6e6;
        border-color: #adadad;
      }

      &:active,
      &.active {
        background-image: none;
        -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        background-color: #e6e6e6;
        border-color: #adadad;
      }

      &:active:hover,
      &:active:focus,
      &.active:hover,
      &.active:focus {
        color: #373a3c;
        background-color: #d4d4d4;
        border-color: #8c8c8c;
      }

      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
        border-right: 1px solid #99999999;
      }
    }
  }
`;

const Toolbar = ({ viewClass, ...props }) => {
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

  return (
    <ToolbarComponent>
      <Group>
        <Button onClick={navigate.bind(null, "TODAY")}>Today</Button>
        <Button onClick={navigate.bind(null, "PREV")}>Back</Button>
        <Button onClick={navigate.bind(null, "NEXT")}>Next</Button>
      </Group>
      <Group>
        {props.view === "month" &&
          `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
        {props.view === "week" &&
          `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
        {props.view === "day" &&
          `${date.getMonth() + 1}월 ${date.getDate()}일 ${
            week[date.getDay()]
          }요일`}
      </Group>
      <Group>
        {view.map((item, idx) => {
          return (
            <Button
              key={idx}
              onClick={onViews.bind(null, item)}
              className={viewClass === item ? "active" : ""}
            >
              {item}
            </Button>
          );
        })}
      </Group>
    </ToolbarComponent>
  );
};

export default Toolbar;
