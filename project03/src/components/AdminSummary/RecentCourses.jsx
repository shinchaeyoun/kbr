// 최근 등록
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import axios from 'axios';

const RecentCourses = () => {
  return (
    <S.Block>
     최근 게시물
    </S.Block>
  );
};

export default RecentCourses;