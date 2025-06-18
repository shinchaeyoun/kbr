import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

// Components
import BoardListForm from "../components/forms/BoardListForm.jsx";
import NavigationItem from "../components/NavigationItem.jsx";

const SubjectBoard = () => {
  const API_URL = "http://192.168.23.2:5001/board"; // API URL 상수화
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || location.pathname.split("/").slice(-1).join("/");

  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];

  const [list, setList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          code: projectCode,
          category: category,
          id: subjectId,
        },
      });
      setList(response.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.state?.category, location.pathname]);

  const test = () => {
    // console.log("카테고리 클릭:", category);
    // console.log("현재 주소:", location.pathname);
  };

  // h1 태그에 직접 style 속성 적용
  return (
    <>
      {category && (
        <div>
          <h1 onClick={test} style={{ fontSize: '24px' }}>{category}</h1>
          <BoardListForm data={[...list]} category={category} />
        </div>
      )}
    </>
  );
};

export default SubjectBoard;
