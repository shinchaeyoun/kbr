import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";

//components
import Board from "../components/Board.jsx";

const ButtonWrap = styled(S.FlexBox)`
  gap: 0 10px;
`;

const BoardDetail = () => {
  const level = localStorage.level;
  const navigate = useNavigate();

  const { idx } = useParams();
  const [board, setBoard] = useState({});

  const getBoard = async () => {
    const resp = await (
      await axios.get(`http://192.168.23.2:5100/project/`)
    ).data[idx];

    setBoard(resp);
  };

  const moveToUpdate = (idx, e) => {
    if (level > 2) {
      navigate("/board/update/" + idx);
    } else {
      alert("수정 권한 없음");
    }
  };

  const deleteBoard = async (idx, e) => {
    if (level <= 3) {
      alert("삭제 권한 없음");
      return false;
    }
    const deletCode = "de";
    const deletProm = prompt("삭제암호를 입력하세요", "");
    const userVal = deletProm;

    if (userVal != null) {
      if (userVal == deletCode) {
        await axios
          .delete("http://192.168.23.2:5100/board/delete", {
            data: { idx: idx },
          })
          .then((res) => {
            navigate(0);
          });
      } else {
        alert("잘못된 비밀번호입니다.");
      }
    }
  };

  useEffect(() => {
    getBoard();
  }, []);

  return (
    <>
      <Board {...board} />

      <ButtonWrap className="buttonWrap">
        <S.Button
          onClick={(e) => {
            moveToUpdate(board.idx, e);
          }}
        >
          수정하기
        </S.Button>
        <S.Button
          onClick={(e) => {
            deleteBoard(board.idx, e);
          }}
        >
          삭제하기
        </S.Button>
      </ButtonWrap>
    </>
  );
};

export default BoardDetail;
