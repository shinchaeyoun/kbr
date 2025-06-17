import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import B from "../../styled/BoardStyled.jsx";
import L from "../../styled/ListStyled.jsx";
import axios from "axios";

const ListForm = ({ data }) => {
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1];

  console.log("data ::", data);

  return (
    <L.ListWrap>
      <L.AddPost>작성하기</L.AddPost>
      <L.Content>
        <L.TitleBlock>
          <p>번호</p>
          <p>머리말</p>
          <p>제목</p>
          <p>첨부파일</p>
          <p>등록일</p>
          <p>조회수</p>
        </L.TitleBlock>

        {data.map((item, index) => (
          <L.Block key={index}>
            <p>{item.idx}</p>
            <p>{item.tag}</p>
            <p>{item.title}</p>
            <p>{item.attachment}</p>
            <p>{item.date}</p>
            <p>{item.views}</p>
          </L.Block>
        ))}
      </L.Content>
    </L.ListWrap>
  );
};

export default ListForm;
