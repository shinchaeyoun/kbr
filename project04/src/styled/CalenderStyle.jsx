//CalenderStyle
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const Container = styled.div`
  height: 100%;
`;

const CalendarContainer = styled.div`
  
`;

const SideContainer = styled(Container)`
  ${CalendarContainer} {
    // width: 300px;
  }
`;

const ContentContainer = styled(Container)`
  ${CalendarContainer} {
    // width: 1200px;
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
  grid-template-rows: 1fr;
  align-items: center;
  border: 1px solid #c8c8c8;
  height: calc(100vh - (var(--header-height) + var(--footer-height)));
`;

const C = {
  CalendarContainer,
  SideContainer,
  ContentContainer,
  DateContainer,
  CalendarWrap,
};

export default C;
