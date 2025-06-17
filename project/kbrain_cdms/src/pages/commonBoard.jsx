import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import CB from "../styled/CommonBoardStyled.jsx";
import axios from "axios";

import NavigationItem from "../components/NavigationItem.jsx";
import BoardListForm from "../components/forms/BoardListForm.jsx";

const CommonBoard = () => {
  const API_URL = "http://192.168.23.2:5001/board"; // API URL 상수화
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.state?.subjectId || "NULL";

  const navigate = useNavigate();
  const [list, setList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          code: projectCode,
        },
      });
      setList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <CB.Block>
        <CB.BlockTitle>공통게시판</CB.BlockTitle>
        <BoardListForm data={[...list]} />
        <CB.Button
          onClick={() => {
            navigate(`write`, {
              state: { mode: "write" },
            });
          }}
        >
          글쓰기
        </CB.Button>
      </CB.Block>
    </>
  );
};

export default CommonBoard;
