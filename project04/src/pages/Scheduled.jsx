import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalendarComponent from "../components/Calendar.jsx";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import C from "../styled/CalenderStyle.jsx";
import axios from "axios";

const Scheduled = () => {
  return (
    <C.CalendarWrap>
      <C.SideContainer>
        <CalendarComponent />
        <div>some</div>
      </C.SideContainer>

      <C.ContentContainer>
        <CalendarComponent />
      </C.ContentContainer>
    </C.CalendarWrap>
  );
};

export default Scheduled;
