//CalenderStyle
import styled from "styled-components";
import S from "./GlobalBlock";
import M from "./ModalStyled.jsx";
import media from "./media.jsx";

// 툴바 스타일 시작
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


      &:first-child {border-radius: 4px 0 0 4px;}
      &:last-child {border-radius: 0 4px 4px 0; border-right: 1px solid #99999999;}
    }
  }
`;

// 모달 스타일 시작
const DialogButton = styled(S.Button)`
  border-radius: 25px;
`;
const CloseBtn = styled(DialogButton)`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: initial;
  border: none;
`;
const DialogButtonWrap = styled(S.ButtonWrap)`
  text-align: right;
  flex-direction: row;
  justify-content: flex-end;
`;
const DialogInput = styled.input`
  width: 100%;
  font-size: 22px;
  padding: 3px 5px;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #c3c7c9;
`;

const Content = styled.div`
  .label {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    > ul {
      display: flex;
      gap: 10px;
      list-style: none;
      padding-left: 0px;
      > li {
        width: 20px;
        height: 20px;
        border-radius: 50%;

        ${({ $labels }) =>
          $labels &&
          $labels.map(
            (label) => `
              &.${label.name} {background-color: ${label.color};}
            `
          )}

        &.active {
          transform: scale(1.2);
          border: 1px solid #ffffff;
          box-shadow: 0px 0px 5px rgb(0 0 0 / 44%);
        }
      }
    }
  }
`;
const DialogBody = styled.div`
  padding: 0 30px 30px;
`;
const DialogHeader = styled.div`
  height: 50px;
  margin-bottom: 10px;
  &:hover {
    background-color: #0000001a;
    cursor: move;
  }
`;
const DialogContent = styled(M.ModalContent)`
  width: 450px;
  height: 500px;
  background-color: #f0f4f9;
  border-radius: 30px;
  box-shadow: 2px 4px 10px rgba(63, 63, 63, 0.2);

  top: 0px;
  left: 0px;
  transform: translate(0, 0);

  overflow: hidden;
`;
const DialogWrap = styled(M.ModalWrap)`
  background-color: transparent;
`;

// 캘린더 스타일 시작
const CalendarComponent = styled.div`
  .rbc-event {
    background-color: ${`var(--label-pink)`};
  }
`;

const Container = styled.div`
  height: 100%;
`;
const CalendarContainer = styled.div``;

const SideContainer = styled(Container)`
  ${CalendarContainer} {
  }
`;

const ContentContainer = styled(Container)`
  ${CalendarContainer} {
    height: 100%;
  }
`;

const DateContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  > div {
    border: 1px solid #6580ea;
    border-radius: 7px;
    padding: 5px 10px;

    cursor: pointer;
  }
`;

const CalendarWrap = styled.div`
  display: grid;
  grid-template-columns: 20% 80%;

  grid-template-columns: ${({ $sideCalendar }) =>
    $sideCalendar ? "20% 80%" : "1fr"};
  grid-template-rows: 1fr;
  align-items: center;

  height: calc(100vh - (var(--header-height) + var(--footer-height)));
  font-family: "OutfitRegular", "Pretendard-Regular" !important;
`;

const Wrap = styled.div`
  ${CalendarComponent} {
    .rbc-event {
      ${({ $events }) =>
        $events.map(
          (item) => `
            &.${item.label} {
              background-color: ${`var(--label-${item.label})`};
            }
          `
        )};
    }
  }
`;

const C = {
  ToolbarComponent,
  Group,
  Button,
  DialogButton,
  CloseBtn,
  DialogButtonWrap,
  DialogInput,
  Content,
  DialogBody,
  DialogHeader,
  DialogContent,
  DialogWrap,
  CalendarComponent,
  CalendarContainer,
  SideContainer,
  ContentContainer,
  DateContainer,
  CalendarWrap,
  Wrap,
};

export default C;
