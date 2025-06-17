import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from 'axios';
import CalendarComponent from "../components/CalendarComponent.jsx";



const ProjectSchedule = () => {

  return (
    <>
     <S.Block>
      <h2>프로젝트 진행률</h2>
     </S.Block>
     <S.Block>
      <h2>일정표</h2>
      <div>달력</div>
      <CalendarComponent />
     </S.Block>
    </>
  );
};

export default ProjectSchedule;