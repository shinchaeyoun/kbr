// 등록된 과정
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import axios from "axios";

const Block = styled(S.Block)`
  position: relative;

  button {
    position: absolute;
        right: 10px;
    bottom: 10px;
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

  const getBoard = () => {
    axios.get("http://192.168.23.65:5000/board?limit=5").then((res) => {
      console.log(res.data, "data");
      setBoardList(res.data);
    });
  };
  const moveToBoard = (idx) => {
    const index = boardList.findIndex((item) => item.idx === idx);
    navigate(`/board/${index}`);
  };

  const moveToList = () => {
    navigate('/board');
  }
  useEffect(() => {
    getBoard();
  }, []);

  return (
    <Block>
      <Title>등록된 과정</Title>

      <div>
        {boardList.map((item) => (
          <div
            key={item.idx}
            onClick={() => {
              moveToBoard(item.idx);
            }}
          >
            {item.title}
          </div>
        ))}
      </div>

      <button onClick={moveToList}>과정 전체보기</button>
    </Block>
  );
};

export default RegisteredCourses;
