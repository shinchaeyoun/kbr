import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";

//components
import Board from "../components/Board.jsx";

const BoardDetail = () => {
  const { idx } = useParams();
  const [board, setBoard] = useState({});

  const getBoard = async () => {
    const resp = await (
      await axios.get(`http://192.168.23.65:5000/board/`)
    ).data[idx];

    setBoard(resp);
  };

  useEffect(() => {
    getBoard();
  }, []);


  return (
    <>
      <Board
        idx={board.idx}
        title={board.title}
        customer={board.customer}
        innerUrl={board.innerUrl}
        outerUrl={board.outerUrl}
      />
    </>
  );
};

export default BoardDetail;
