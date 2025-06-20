import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  align-content: center;
  height: calc(100vh - 300px);
  text-align: center;
  font-weight: bold;
`;

const DeletedPage = () => (
  <Wrap>
    <h2>삭제된 글 입니다.</h2>
    {/* 관리자가 되돌리기 할 수 있게 할까 ? */}
  </Wrap>
);

export default DeletedPage;
