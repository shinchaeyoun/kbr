import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import S from "../styled/GlobalBlock";
import B from "../styled/BoardStyled.jsx";
import axios from "axios";
import Modal from "../components/Modal.jsx";

const BoardList = ({ level }) => {
  const [boardList, setBoardList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearch, setSearch] = useState({ search: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoardIdx, setIsBoardIdx] = useState();
  const [modalMode, setModalMode] = useState("view");
  const [isType, setType] = useState("card"); // card, list
  const [isGridColumn, setIsGridColumn] = useState(5);

  const currentYear = new Date().getFullYear(); // 현재 연도 가져오기
  const [selectYear, setSelectYear] = useState(currentYear);

  const { search } = isSearch;
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

  // 검색
  const onSearch = async () => {
    try {
      setBoardList([]); // 상태 초기화
      setOffset(0); // offset 초기화
      setHasMore(false); // 검색 결과는 더보기 버튼 숨김

      const response = await axios.post(
        `http://192.168.23.65:5000/board/search`,
        { search: search, year: selectYear }
      );

      setBoardList(response.data); // 검색 결과 설정
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  // 보기 타입 변경
  const setList = (type) => {
    if (type === "list") {
      setType("list");
    } else if (type === "card") {
      setType("card");
    }
  };

  // 모달 열기
  const openModal = (idx) => {
    setIsBoardIdx(idx);
    setIsModalOpen(true);
  };

  const onModalClose = async (val, idx) => {
    if (val === "delete") {
      setBoardList((prevList) => prevList.filter((item) => item.idx !== idx));
    } else {
      try {
        // 새로 등록된 데이터를 가져오기 위해 서버에서 최신 데이터를 요청
        const response = await axios.get(`http://192.168.23.65:5000/board`, {
          params: { offset: 0, limit: 1 }, // 최신 데이터 1개만 가져옴
        });

        if (response.data[0].idx >= isBoardIdx) return; // 방금 수정된 데이터는 제외
        const newBoard = response.data[0]; // 새로 등록된 데이터
        setBoardList((prevList) => [newBoard, ...prevList]); // 새 데이터를 맨 앞에 추가
      } catch (error) {
        console.error("새 데이터를 가져오는 중 오류 발생:", error);
      }
    }
  };

  // 더보기 버튼 클릭
  const moreList = () => {
    setOffset((prevOffset) => prevOffset + limit); // offset 증가
  };

  // 검색 입력 처리
  const onChange = (e) => {
    const { name, value } = e.target;
    // setIsYear(() =>)
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

  // 팝업창 열기
  const openPup = (link, title) => {
    const popup = window.open(
      `${link}`,
      `${title}`,
      "width=1300px,height=800px,scrollbars=yes"
    );
  };

  // 초기 데이터 로드
  useEffect(() => {
    setBoardList([]); // 상태 초기화
    setOffset(0); // offset 초기화
    getBoardList(); // 게시글 목록 가져오기
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
    <B.Container>
      <Modal
        mode={modalMode}
        itemIdx={isBoardIdx}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onModalClose={onModalClose}
        level={level}
      />

      <B.SearchContainer>
        <B.Search>
          <S.Select
            name="year"
            value={selectYear}
            onChange={(e) => {
              setSelectYear(e.target.value);
              setSearch({ ...isSearch, year: e.target.value });
            }}
          >
            <option value="all" style={{ backgroundColor: "lightgray" }}>
              전체보기
            </option>
            {Array.from({ length: 7 }, (_, i) => {
              const year = currentYear + 1 - i; // SelectYear부터 이전 5년까지 옵션 생성
              return (
                <option
                  key={year}
                  value={year}
                  style={{
                    backgroundColor:
                      year === selectYear ? "lightblue" : "white",
                  }}
                >
                  {year}
                </option>
              );
            })}
          </S.Select>

          <S.Input
            type="text"
            name="search"
            value={search || ""}
            onChange={onChange}
            onKeyDown={handleKeyPress}
          />
        </B.Search>

        <S.ButtonWrap direction="row">
          <B.Button theme="light" onClick={onSearch}>
            과정검색
          </B.Button>
          {level > 2 && (
            <B.Button
              theme="dark"
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
            </B.Button>
          )}
        </S.ButtonWrap>
      </B.SearchContainer>

      <S.ButtonWrap direction="row-reverse">
        {["list", "card"].map((type) => (
          <S.Button
            key={type}
            $padding="0 6px"
            className={isType === type ? "on" : ""}
            onClick={() => setList(type)}
          >
            {type === "list" ? (
              <B.ListIcon></B.ListIcon>
            ) : (
              <B.CardIcon></B.CardIcon>
            )}
          </S.Button>
        ))}
      </S.ButtonWrap>

      <B.GridContainer className={isType} type={isType} $cl={isGridColumn}>
        {boardList.map((board) => (
          <B.BoardItem
            key={board.idx}
            onClick={() => {
              openPup(board.outerUrl, board.title);
            }}
          >
            <S.Thumb
              src={`${board.thumb}?t=${new Date().getTime()}`}
              alt={board.title}
            />

            <B.Group>
              {isType === "list" ? (
                <B.ListTitle>
                  <p>{board.title}</p>
                  {isType === "list" && <span>{board.outerUrl}</span>}
                </B.ListTitle>
              ) : (
                <B.CardTitle>
                  <p>{board.title}</p>
                </B.CardTitle>
              )}

              <S.Button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalMode("view");
                  openModal(board.idx);
                }}
              >
                ⁝
              </S.Button>
            </B.Group>
          </B.BoardItem>
        ))}
      </B.GridContainer>

      <B.CenterBox>
        {hasMore && (
          <B.Button theme="light" onClick={moreList}>
            더보기
          </B.Button>
        )}
      </B.CenterBox>
    </B.Container>
  );
};

export default BoardList;
