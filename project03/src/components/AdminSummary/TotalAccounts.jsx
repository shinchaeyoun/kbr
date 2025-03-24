// 총 계정 수
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import axios from 'axios';

const TotalAccounts = () => {
  return (
    <S.Block>
     총계정수
    </S.Block>
  );
};

export default TotalAccounts;