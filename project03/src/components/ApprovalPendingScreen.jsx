import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

const ApprovalPendingScreen = () => {
  const onLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_lvl");
    document.location.href = "/";
  };

  return (
    <>
      승인 대기중
      <br/>
      <button type="button" onClick={onLogout}>
        logout
      </button>
    </>
  );
};

export default ApprovalPendingScreen;
