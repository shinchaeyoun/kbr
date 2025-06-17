import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  align-content: center;
  height: calc(100vh - 100px);
  text-align: center;
  font-weight: bold;
`;

const ApprovalPendingScreen = () => {
  const onLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_lvl");
    document.location.href = "/";
  };

  return (
    <Wrap>
      <h2>승인 대기중</h2>
      <br/>
      <button type="button" onClick={onLogout}>
        logout
      </button>
    </Wrap>
  );
};

export default ApprovalPendingScreen;
