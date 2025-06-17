import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import S from "../../styled/GlobalBlock";

import axios from "axios";

const FlexBox = styled(S.FlexBox)`
  flex-direction: row-reverse;
  gap: 0 10px;
  margin-bottom: 10px;
`;

const ButtonWrap = styled(S.FlexBox)`
  gap: 0 10px;
`;

const Search = styled.div`
 input {
 width: 250px;
  margin: 0 10px;
 height: 20px; 
 }
`;

const BoardList = (props) => {
  const navigate = useNavigate();

  const level = props.level;

  const [boardList, setboardList] = useState([]);
  const [isSearch, setSearch] = useState({ search: "" });
  const { search } = isSearch;


  const getboardList = async () => {
    await axios
      .get("http://192.168.23.2:5000/board")
      .then((res) => setboardList(res.data));
  };

  const onChange = (e) => {
    const { value, name } = e.target;
    setSearch({
      ...isSearch,
      [name]: value || "",
    });
  };

  const onSearch = async () => {
    await axios.post(`http://192.168.23.2:5000/board/search`, isSearch).then((res) => {
      setboardList(res.data);
    });
  };

  const moveToWrite = () => {

    if (level > 2) {
      navigate("/board/write");
    } else {
      alert("글쓰기 권한 없음");
    }
  };

  const linkToBoard = (idx, e) => {
    const index = boardList.findIndex((item) => item.idx === idx);
    navigate(`/board/${index}`);
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
          .delete("http://192.168.23.2:5000/board/delete", {
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
    getboardList();
    setSearch({ search: "" });
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <>
      <FlexBox>
        <S.Button onClick={moveToWrite}>과정등록</S.Button>

        <Search>
          <input
            type="text"
            name="search"
            value={search || ""}
            onChange={onChange}
            onKeyDown={handleKeyPress}
          />
          <S.Button onClick={onSearch}>과정검색</S.Button>
        </Search>
      </FlexBox>

      {boardList.map((board) => (
        <S.BoardItem key={board.idx}>
          <div
            className="title"
            onClick={(e) => {
              linkToBoard(board.idx, e);
            }}
          >
            {board.title}
          </div>
          <div className="customer">
            <span>업체명</span>
            {board.customer}
          </div>
          <div className="innerUrl">
            <span>과정경로</span>
            {board.innerUrl}
          </div>
          <div className="outerUrl">
            <span>URL</span>
            {board.outerUrl}
          </div>

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
        </S.BoardItem>
      ))}
    </>
  );
};

export default BoardList;
