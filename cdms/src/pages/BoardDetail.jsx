import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

//components
import Board from "../components/Board.jsx";

const BoardDetail = () => {
  const { idx } = useParams();
  const [board, setBoard] = useState({});

  const getBoard = async () => {
    const resp = await (
      await axios.get(`http://192.168.23.2:5000/board/`)
    ).data[idx];
    setBoard(resp);
  };

  useEffect(() => {
    getBoard();
  }, []);


  return (
    <>
      <Board {...board}/>
    </>
  );
};

export default BoardDetail;
