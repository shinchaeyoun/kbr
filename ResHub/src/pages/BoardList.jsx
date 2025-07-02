import React, { useEffect, useState } from "react";
import S from "../styled/GlobalBlock";
import B from "../styled/BoardStyled.jsx";
import axios from "axios";
import Modal from "../components/Modal.jsx";

const BoardList = ({ level }) => {
  const API_URL = 'http://192.168.23.2:5000/project';
  const [boardList, setBoardList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSearch, setSearch] = useState({ search: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoardIdx, setIsBoardIdx] = useState();
  const [modalMode, setModalMode] = useState("view");
  const [isType, setType] = useState("card"); // card, list
  const [isGridColumn, setIsGridColumn] = useState(5);
  const [modalData, setModalData] = useState(null); // 모달에 전달할 데이터
  const [isEmptyLink, setIsEmptyLink] = useState(false); // 링크가 없는 경우

  const currentYear = new Date().getFullYear(); // 현재 연도 가져오기
  const [selectYear, setSelectYear] = useState(currentYear);

  const { search } = isSearch;
  const limit = 10;

  // 서버에서 게시글 목록 가져오기
  const getBoardList = async () => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { offset, limit },
      });

      if (response.data.length < limit) setHasMore(false);

      setBoardList((prevList) => {
        const uniqueItems = new Map();
        [...prevList, ...response.data].forEach((item) => {
          uniqueItems.set(item.code, {
            ...item,
            thumb: `${item.thumb}?t=${new Date().getTime()}`, // 타임스탬프 추가
          });
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
      // setBoardList([]); // 상태 초기화
      setOffset(0); // offset 초기화
      setHasMore(false); // 검색 결과는 더보기 버튼 숨김

      const response = await axios.post(
        `http://192.168.23.2:5000/project/search`,
        { search: search, year: selectYear }
      );

      setBoardList(response.data); // 검색 결과 설정
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    }
  };

  // 보기 타입 변경
  const setList = (type) => setType(type);

  // 모달 열기
  const openModal = (code, data = {}) => {
    setIsBoardIdx(code);
    setModalData(data); // 추가 데이터 설정
    setIsModalOpen(true);
  };

  // 모달 닫기 및 데이터 갱신
  const onModalClose = async (val, idx) => {
    console.log('onModalClose', idx);

    if (val === "delete") {
      setBoardList((prevList) => prevList.filter((item) => item.idx !== idx));
    } else {
      try {
        if (search || selectYear) {
          const response = await axios.post(
            `http://192.168.23.2:5000/project/search`,
            { search: search, year: selectYear }
          );
          setBoardList(response.data);
        } else {
          const response = await axios.get(`http://192.168.23.2:5000/project`, {
            params: { offset: 0, limit: limit },
          });
          setBoardList(response.data);
        }
      } catch (error) {
        console.error("데이터 갱신 중 오류 발생:", error);
      }
    }
  };

  // 더보기 버튼 클릭
  const moreList = () => setOffset((prevOffset) => prevOffset + limit);

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

  // 팝업창 열기
  const openPup = (link, title, idx) => {
    // 링크가 없으면 상태를 설정하고 모달 열기
    // if (link === "" || link === null) {
    //   setIsEmptyLink(true);
    //   return openModal(idx);
    // }

    // const popup = window.open(
    //   `${link}`,
    //   `${title}`,
    //   "width=1300px,height=800px,scrollbars=yes"
    // );
    if (!link) {
      setModalMode("view");
      setIsEmptyLink(true);
      return openModal(idx);
    }

    window.open(link, title, "width=1300px,height=800px,scrollbars=yes");
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
    // if (!isModalOpen) getBoardList();
    if (!isModalOpen) {
      if (search || selectYear !== currentYear) {
        onSearch(); // 검색 결과 유지
      } else {
        getBoardList(); // 전체 목록 갱신
      }
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
        isEmptyLink={isEmptyLink}
        setIsEmptyLink={setIsEmptyLink}
      />

      <B.SearchContainer>
        <B.Search>
          <S.Select
            name="year"
            value={selectYear}
            onKeyDown={(e) => {
              handleKeyPress(e)
              e.preventDefault();
            }}
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
            key={board.code}
            onClick={() => {
              openPup(board.outerUrl, board.title, board.code);
            }}
          >
            <S.Thumb
              src={`${board.thumb}?t=${new Date().getTime()}`}
              alt={board.title}
            />

            <B.Group className="group" $isType={isType}>
              {isType === "list" ? (
                <B.ListTitle className="ListTitle">
                  <p>{board.title}</p>
                  {board.outerUrl && (
                    <span>{board.outerUrl}</span>
                  )}

                </B.ListTitle>
              ) : (
                <B.CardTitle className="CardTitle">
                  <p>{board.title}</p>
                </B.CardTitle>
              )}

              <S.Button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalMode("view");
                  openModal(board.code);
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
