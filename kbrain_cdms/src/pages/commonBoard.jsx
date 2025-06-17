import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CB from "../styled/CommonBoardStyled.jsx";
import axios from "axios";

import BoardListForm from "../components/forms/BoardListForm.jsx";

const CommonBoard = () => {
  const API_URL = "http://192.168.23.2:5001/board"; // API URL 상수화
  const projectCode = location.pathname.split("/")[1];

  const navigate = useNavigate();
  const [list, setList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          code: projectCode
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
      </CB.Block>
    </>
  );
};

export default CommonBoard;
