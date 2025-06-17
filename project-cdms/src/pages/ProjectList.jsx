import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";
import "../App.css";

const ProjectList = () => {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // 서버에서 게시글 목록 가져오기
  const getBoardList = async () => {
    try {
      const response = await axios.get(`http://192.168.23.65:5001/board`, {
        params: { offset, limit },
      });

      if (response.data.length < limit) {
        setHasMore(false); // 더 이상 데이터가 없으면 false로 설정
      }

      setBoardList((prevList) => {
        const uniqueItems = new Map();
        [...prevList, ...response.data].forEach((item) => {
          uniqueItems.set(item.idx, {
            ...item,
            thumb: `${item.thumb}?t=${new Date().getTime()}`, // 타임스탬프 추가
          }); // idx를 키로 사용하여 중복 제거
        });
        return Array.from(uniqueItems.values());
      });
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const moveToPage = (idx) => {
    navigate(`/${idx}`); // 해당 idx로 페이지 이동
  }

  // 초기 데이터 로드
  useEffect(() => {
    setBoardList([]); // 상태 초기화
    setOffset(0); // offset 초기화
    getBoardList(); // 게시글 목록 가져오기
  }, []);
  return (
    <>
      <h3>전체과정</h3>
      <div>
        {boardList.map((item, idx) => (
          <div key={idx}
            className="project-list-item"
            onClick={() => {moveToPage(item.idx)}}
          >
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProjectList;
