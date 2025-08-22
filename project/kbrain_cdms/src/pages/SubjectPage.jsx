import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from 'axios';

import PercentBar from "../components/PercentBar.jsx";

const SubjectPage = () => {
  return (
    <> 
     과목페이지
     <PercentBar />
    </>
  );
};

export default SubjectPage;