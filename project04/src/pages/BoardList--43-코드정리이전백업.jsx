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

const BoardList = ({level}) => {
  const navigate = useNavigate();

  const [boardList, setboardList] = useState([]);
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

  const calculateGridColumn = () => {
    const set_width = 255; // 기준 너비
    let columns = Math.floor(window.innerWidth / set_width);
    if (columns > 5) columns = 5;
    if (columns < 2) columns = 2;
    setIsGridColumn(columns); // 계산된 그리드 값 설정
  };
  
  // 서버 관련
  const getBoardList = async () => {
    await axios.get(`http://192.168.23.65:5000/board`, {
      params: { isoffset, offset },
    }).then((res) => {
      console.log('받아온 데이터',res.data);
      
      setboardList(res.data)
    });
  };

  const fetchBoardList = async () => {
    try {
      const response = await axios.get(`http://192.168.23.65:5000/board`, {
        params: { offset, limit },
      });

      if (response.data.length < limit) {
        setHasMore(false); // 더 이상 데이터가 없으면 false로 설정
      }

      // setboardList((prevList) => {
      //   const newData = response.data.filter(
      //     (item) => !prevList.some((prevItem) => prevItem.idx === item.idx)
      //   );
      //   return [...prevList, ...newData];
      // });
      setboardList((prevList) => {
        const uniqueItems = new Map();
        [...prevList, ...response.data].forEach((item) => {
          uniqueItems.set(item.idx, item); // idx를 키로 사용하여 중복 제거
        });
        return Array.from(uniqueItems.values());
      });
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
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
        .delete("http://192.168.23.65:5000/board/delete", {
          data: { idx: idx },
        })
        .then((res) => {
          setboardList((prevList) => prevList.filter((item) => item.idx !== idx));
        });
      } else {
        alert("잘못된 비밀번호입니다.");
      }
    }
  };


  const setList = (type) => {
    if (type === "list") {
      setType("list");
    } else if (type === "card") {
      setType("card");
    }
  };

  const openModal = (idx) => {
    setIsBoardIdx(idx);
    setIsModalOpen(true);
  };

  const moreList = () => {
    setOffset((prevOffset) => prevOffset + limit); // offset 증가
  };


  // 검색 관련
  const onChange = (e) => {
    const { value, name } = e.target;
    setSearch({
      ...isSearch,
      [name]: value || "",
    });
  };

  const onSearch = async () => {
    try {
      setboardList([]); // 상태 초기화
      setOffset(0); // offset 초기화
      setHasMore(false); // 검색 결과는 더보기 버튼을 숨김

      const response = await axios.post(
        `http://192.168.23.65:5000/board/search`,
        isSearch
      );

      // 검색 결과만 설정
      setboardList(response.data);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
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
    setboardList([]); // 상태 초기화
    setOffset(0); // offset 초기화
    fetchBoardList();
  }, []); // 첫 화면 로딩 시 실행

  useEffect(() => {
    // if (offset === 0 && boardList.length > 0) return; // 첫 로딩 시 중복 호출 방지
    if (offset === 0) return; // 첫 로딩 시 중복 호출 방지
    fetchBoardList();
  }, [offset]); // offset이 변경될 때마다 데이터 요청

  useEffect(() => {
    // if (offset === 0 && boardList.length > 0) return; // 첫 로딩 시 중복 호출 방지
    // if (offset === 0) return; // 첫 로딩 시 중복 호출 방지
    // fetchBoardList();
    getBoardList();
    console.log('isModalOpen 변경됨. 보드 리스트 다시 가져오기');
    
  }, [isModalOpen]); // isModalOpen이 변경될 때마다 데이터 요청

  

  useEffect(() => {
    // 페이지 로드 및 리사이즈 이벤트 등록
    window.addEventListener("load", calculateGridColumn);
    window.addEventListener("resize", calculateGridColumn);

    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      window.removeEventListener("load", calculateGridColumn);
      window.removeEventListener("resize", calculateGridColumn);
    };
  }, []);

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
              <S.Thumb src={`${board.thumb}`}></S.Thumb>
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
