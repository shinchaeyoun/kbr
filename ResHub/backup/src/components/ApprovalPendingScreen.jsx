import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  align-content: center;
  height: calc(100vh - 300px);
  text-align: center;
  font-weight: bold;
`;

const ApprovalPendingScreen = () => (
  <Wrap>
    <h2>승인 대기중</h2>
  </Wrap>
);

export default ApprovalPendingScreen;
