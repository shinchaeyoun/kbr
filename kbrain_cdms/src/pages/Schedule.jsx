import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from 'axios';

const Schedule = () => {
  const [height, setHeight] = useState('');
  
  useEffect(() => {
    setHeight(window.innerHeight);
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      2023년 데이터 역량강화 교육과정 개발 및 운영 일정표
     <div style={{width:"100%", height:height-140 }}>
      <iframe src="https://docs.google.com/spreadsheets/d/1vIWLlkXHLVXLNoXbfsegksz_ikEPdxpseZhbJ0PGhA8/edit?usp=sharing" width="100%" height="100%"></iframe>
     </div>
    </>
  );
};

export default Schedule;