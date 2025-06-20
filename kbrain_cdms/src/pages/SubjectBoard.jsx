import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

// Components
import BoardListForm from "../components/forms/BoardListForm.jsx";
import NavigationItem from "../components/NavigationItem.jsx";

// utils
import { changeCateName } from "@/utils/changeCateName";

const SubjectBoard = () => {
  const API_URL = "http://192.168.23.2:5001/board"; // API URL 상수화
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.search.split("=")[1];
  const [categoryName, setCategoryName] = useState(category || ""); // 카테고리 이름 상태

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

    // if(category == "common") setCategoryName("공통 게시판");
    // if(category == "script") setCategoryName("원고");
    // if(category == "sb") setCategoryName("보드");
    // if(category == "voice") setCategoryName("음성");
    // if(category == "animation") setCategoryName("애니");
    // if(category == "video") setCategoryName("영상");
    // if(category == "design") setCategoryName("디자인");
    // if(category == "content") setCategoryName("개발");

    setCategoryName(changeCateName(category))
  };

  useEffect(() => {
    fetchData();
  }, [location.state?.category, location.pathname, location.search]);

  const test = () => {
    console.log("카테고리 클릭:", category);
  };

  // h1 태그에 직접 style 속성 적용
  return (
    <>
      {category && (
        <div>
          <h1 onClick={test} style={{ fontSize: '24px' }}>{categoryName}</h1>
          <BoardListForm data={[...list]} category={category} />
        </div>
      )}
    </>
  );
};

export default SubjectBoard;
