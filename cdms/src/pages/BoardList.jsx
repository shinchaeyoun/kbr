import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import S from "../styled/GlobalBlock";

import axios from "axios";

import Modal from "../components/Modal.jsx";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoardIdx, setIsBoardIdx] = useState();
  const [modalMode, setModalMode] = useState("view");

  const openModal = (idx) => {
    const index = boardList.findIndex((item) => item.idx === idx);
    console.log("idx", idx, index);
    setIsBoardIdx(idx);
    setIsModalOpen(!isModalOpen);
  };

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
    await axios
      .post(`http://192.168.23.2:5000/board/search`, isSearch)
      .then((res) => setboardList(res.data));
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

  const openPup = (link, title) => {
    const popup = window.open(
      `${link}`,
      `${title}`,
      "width=1300px,height=800px,scrollbars=yes"
    );
  };

  useEffect(() => {
    getboardList();
    setSearch({ search: "" });
  }, [isModalOpen]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="board-list">
      <Modal
        mode={modalMode}
        itemIdx={isBoardIdx}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <FlexBox>
        <S.Button
          onClick={() => {
            // moveToWrite
            setModalMode("write");
            openModal();
          }}
        >
          과정등록
        </S.Button>

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
            // onClick={(e) => {
            //   linkToBoard(board.idx, e);
            // }}
            onClick={() => {
              setModalMode("view");
              openModal(board.idx);
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
          <div
            className="outerUrl"
            onClick={() => {
              openPup(board.outerUrl, board.title);
            }}
          >
            <span>URL</span>
            {board.outerUrl}
          </div>

          <ButtonWrap className="buttonWrap">
            <S.Button
              onClick={(e) => {
                setModalMode("update");
                openModal(board.idx);
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
    </div>
  );
};

export default BoardList;
