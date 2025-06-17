import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import "../styles/modal.scss";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

import BoardForm from "./forms/BoardForm.jsx";

const ModalWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  // height: 100%;
  min-height: 100vh;

  z-index: 999;

  background-color: rgba(0, 0, 0, 0.6);
`;

const Content = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;

  padding: 30px;

  overflow-y: scroll;

  > div {
    display: flex;

    > p {
      margin-right: 10px;
      font-weight: bold;
      flex-shrink: 0;
    }
  }

  // ${S.Button} {
  //   position: absolute;
  //   top: 20px;
  //   right: 30px;
  // }
`;

const Modal = (props) => {
  console.log("props.isModalOpen", props.isState);

  const mode = props.isState;

  const board = props.board[props.idx];
  const closeModal = () => {
    if (mode !== "view") {
      const closeConfirm = confirm("창 닫기");
      closeConfirm && props.setIsModalOpen(false);
    } else {
      props.setIsModalOpen(false);
    }
  };

  return (
    <>
      {props.isModalOpen && (
        <>
          <ModalWrap className="modal-wrap" onClick={closeModal}>
            {mode == "view" ? (
              <Content className="content" onClick={(e) => e.stopPropagation()}>
                {mode}
                <h2>{board.title}</h2>
                <h3>세부 과정명: {board.subTitle}</h3>
                <div>
                  <p>고객사: </p>
                  {board.customer}
                </div>
                <div>
                  <p>총괄PM: </p>
                  {board.pm1}
                </div>
                <div>
                  <p>과정PM: </p>
                  {board.pm2}
                </div>
                <div>
                  <p>개발PM: </p>
                  {board.pm3}
                </div>
                <div>
                  <p>착수시작: </p>
                  {board.startAt}
                </div>
                <div>
                  <p>완료예정: </p>
                  {board.scheduledAt}
                </div>
                <div>
                  <p>완료일: </p>
                  {board.completedAt}
                </div>
                <div>
                  <p>총차시수: </p>
                  {board.totalCha}
                </div>
                <div>
                  <p>신고시간: </p>
                  {board.lmsTime}
                </div>
                <div>
                  <p>운영코드: </p>
                  {board.lmsCode}
                </div>
                <div>
                  <p>내부 경로: </p>
                  {board.innerUrl}
                </div>
                <div>
                  <p>외부 경로: </p>
                  {board.outerUrl}
                </div>
                <div>
                  <p>업체담당자: </p>
                  {board.customerName}
                </div>
                <div>
                  <p>연락처: </p>
                  {board.customerTel}
                </div>
                <div>
                  <p>교육예정일: </p>
                  {board.customerPlan}
                </div>
                <div>
                  <p>포팅업체: </p>
                  {board.pottingComp}
                </div>
                <div>
                  <p>기타사항: </p>
                  {board.etc}
                </div>

                <S.Button onClick={closeModal}>X</S.Button>
              </Content>
            ) : (
              <Content className="content" onClick={(e) => e.stopPropagation()}>
                <BoardForm
                  mode={mode}
                  idx={props.isBoardIdx}
                  setIsModalOpen={props.setIsModalOpen}
                />
              </Content>
            )}
          </ModalWrap>
        </>
      )}
    </>
  );
};

export default Modal;
