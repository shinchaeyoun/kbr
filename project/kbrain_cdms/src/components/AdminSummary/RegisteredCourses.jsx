// 등록된 과정
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import axios from "axios";

import Modal from "../../components/Modal.jsx";

const Block = styled(S.Block)`
  position: relative;

  button {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  p {
    margin: 16px 0;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;

  div {
    margin-left: 10px;
    color: #999;
    font-size: 12px;
  }
`;

const RegisteredCourses = () => {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);

  // 모달 관련
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoardIdx, setIsBoardIdx] = useState();
  const [modalMode, setModalMode] = useState("view");

  const openModal = (idx) => {
    const index = boardList.findIndex((item) => item.idx === idx);
    console.log("idx", idx, index);
    setIsBoardIdx(idx);
    setIsModalOpen(!isModalOpen);
  };
  // 모달 관련 끝

  const getBoard = () => {
    axios.get("http://192.168.23.2:5001/board?limit=5").then((res) => {
      setBoardList(res.data);
    });
  };
  const moveToBoard = (idx) => {
    const index = boardList.findIndex((item) => item.idx === idx);
    navigate(`/board/${index}`);
  };

  const moveToList = () => {
    navigate("/board");
  };
  useEffect(() => {
    getBoard();
  }, []);

  return (
    <>
      <Modal
        mode={modalMode}
        itemIdx={isBoardIdx}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <Block>
        <Title>등록된 과정</Title>

        <div>
          {boardList.map((item) => (
            <p
              key={item.idx}
              onClick={() => {
                // moveToBoard(item.idx);
                openModal(item.idx);
              }}
            >
              {item.title}
            </p>
          ))}
        </div>

        <div className="grid-container"></div>

        <button onClick={moveToList}>과정 전체보기</button>
      </Block>
    </>
  );
};

export default RegisteredCourses;
