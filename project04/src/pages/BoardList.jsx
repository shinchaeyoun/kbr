import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styled/board.scss";
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

const BoardList = ({ level }) => {
  const navigate = useNavigate();

  const [boardList, setBoardList] = useState([]);
  const [isoffset, setIsOffset] = useState(0); // 사라짐짐
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearch, setSearch] = useState({ search: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoardIdx, setIsBoardIdx] = useState();
  const [modalMode, setModalMode] = useState("view");
  const [isType, setType] = useState("card"); // card, list
  const [isGridColumn, setIsGridColumn] = useState(5);

  const { search } = isSearch; // 사라짐짐
  const limit = 10;

  // 서버에서 게시글 목록 가져오기
  const getBoardList = async () => {
    try {
      const response = await axios.get(`http://192.168.23.65:5000/board`, {
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

  // 게시글 삭제
  const deleteBoard = async (idx) => {
    if (level <= 3) {
      alert("삭제 권한 없음");
      return;
    }

    const deleteCode = "de";
    const userInput = prompt("삭제 암호를 입력하세요", "");

    if (userInput === deleteCode) {
      try {
        await axios.delete("http://192.168.23.65:5000/board/delete", {
          data: { idx },
        });
        setBoardList((prevList) => prevList.filter((item) => item.idx !== idx));
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
      }
    } else {
      alert("잘못된 비밀번호입니다.");
    }
  };

  // 검색
  const onSearch = async () => {
    try {
      setBoardList([]); // 상태 초기화
      setOffset(0); // offset 초기화
      setHasMore(false); // 검색 결과는 더보기 버튼 숨김

      const response = await axios.post(
        `http://192.168.23.65:5000/board/search`,
        isSearch
      );

      setBoardList(response.data); // 검색 결과 설정
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  // 모달 열기
  const openModal = (idx) => {
    setIsBoardIdx(idx);
    setIsModalOpen(true);
  };

  const onModalClose = () => {
    getBoardList(); // 데이터를 새로 가져옴
  };

  // 더보기 버튼 클릭
  const moreList = () => {
    setOffset((prevOffset) => prevOffset + limit); // offset 증가
  };

  // 검색 입력 처리
  const onChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value || "",
    }));
  };

  // 화면 크기에 따른 그리드 열 계산
  const calculateGridColumn = () => {
    const setWidth = 255; // 기준 너비
    let columns = Math.floor(window.innerWidth / setWidth);
    columns = Math.max(2, Math.min(columns, 5)); // 최소 2, 최대 5
    setIsGridColumn(columns);
  };
  // 초기 데이터 로드
  useEffect(() => {
    setBoardList([]); // 상태 초기화
    setOffset(0); // offset 초기화
    getBoardList();
  }, []);

  // offset 변경 시 데이터 로드
  useEffect(() => {
    if (offset > 0) getBoardList();
  }, [offset]);

  // 모달 상태 변경 시 데이터 로드
  useEffect(() => {
    if (!isModalOpen) {
      getBoardList();
    }
  }, [isModalOpen]);

  // 화면 크기 변경 이벤트 처리
  useEffect(() => {
    window.addEventListener("load", calculateGridColumn);
    window.addEventListener("resize", calculateGridColumn);

    return () => {
      window.removeEventListener("load", calculateGridColumn);
      window.removeEventListener("resize", calculateGridColumn);
    };
  }, []);

  // 검색 엔터키 처리
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
        onModalClose={onModalClose}
      />

      <FlexBox>
        <S.Button
          onClick={() => {
            if (level > 2) {
              setModalMode("write");
              openModal();
            } else {
              alert("글쓰기 권한 없음");
            }
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

      <FlexBox>
        {["list", "card"].map((type) => (
          <S.Button
            key={type}
            className={isType === type ? "on" : ""}
            onClick={() => setList(type)}
          >
            {type === "list" ? "리스트형" : "카드형"}
          </S.Button>
        ))}
      </FlexBox>

      <S.BoardGridContainer className={isType} type={isType} $cl={isGridColumn}>
        {boardList.map((board) => (
          <S.BoardGridItem
            key={board.idx}
            onClick={() => {
              openPup(board.outerUrl, board.title);
            }}
          >
            <S.dlatl>{board.idx}</S.dlatl>
            <S.Group>
              {/* <S.Thumb src={`${board.thumb}`}></S.Thumb> */}
              <S.Thumb src={`${board.thumb}?t=${new Date().getTime()}`} alt={board.title} />
              <div className="title">{board.title}</div>
            </S.Group>

            <S.ButtonWrap>
              <S.Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (level > 2) {
                    setModalMode("update");
                    openModal(board.idx);
                  } else {
                    alert("수정 권한 없음");
                  }
                }}
              >
                수정하기
              </S.Button>
              <S.Button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBoard(board.idx, e);
                }}
              >
                삭제하기
              </S.Button>
            </S.ButtonWrap>
          </S.BoardGridItem>
        ))}
      </S.BoardGridContainer>

      {hasMore && (
        <S.ButtonWrap className="buttonWrap">
          <S.Button onClick={moreList}>더보기</S.Button>
        </S.ButtonWrap>
      )}
    </div>
  );
};

export default BoardList;
