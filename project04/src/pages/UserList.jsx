import React, { useEffect, useState } from "react";
import U from "../styled/UserStyle.jsx";
import axios from "axios";

// conmponents
import Modal from "../components/Modal.jsx";

// svg
import DoublePrev from "../assets/icon/double-prev-arrow.svg?react";
import Prev from "../assets/icon/prev-arrow.svg?react";
import Next from "../assets/icon/next-arrow.svg?react";
import DoubleNext from "../assets/icon/double-next-arrow.svg?react";

const UserList = (props) => {
  const [totalUser, setTotalUser] = useState([]);
  const [newUser, setNewUser] = useState(0);
  const [isUserList, setIsUserList] = useState([]);
  const [isSearchList, setIsSearchList] = useState([]);
  const [isSearchMode, setSearchMode] = useState(false);
  const [isSearch, setSearch] = useState({ search: "" });
  const [offset, setOffset] = useState(0);
  const [isPage, setPage] = useState(0);
  const [userIdx, setUserIdx] = useState(0);``
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 10; // 한 번에 가져올 데이터 수

  // 사용자 목록 가져오기
  const getUserInfo = async () => {
    const endpoint = isSearchMode
      ? `http://192.168.23.65:5000/user/search`
      : `http://192.168.23.65:5000/user/list`;

    const params = isSearchMode
      ? { limit, offset, isSearch }
      : { limit, offset };

    try {
      const res = await axios[isSearchMode ? "post" : "get"](endpoint, {
        params,
      });
      if (isSearchMode) {
        setIsSearchList(res.data.searchResult);
        setPage(Math.ceil(res.data.totalCount / limit));
      } else {
        setTotalUser(res.data.totalCount);
        setNewUser(res.data.lowLevelCount);
        setIsUserList(res.data.userList);
        setPage(Math.ceil(res.data.totalCount / limit));
      }
    } catch (err) {
      console.error("데이터를 가져오는 중 오류 발생:", err);
    }
  };

  // 검색
  const onSearch = async () => {
    console.log('isSearch',isSearch);
    
    setSearchMode(true);
    setOffset(0); // 검색 시 offset 초기화
    await getUserInfo();
  };

  // 검색 입력 핸들러
  const onChange = (e) => {
    const { value, name } = e.target;
    setSearch({ ...isSearch, [name]: value });
  };

  // 페이지 버튼 클릭 핸들러
  const handlePageBtn = (direction) => {
    return () => {
      if (direction === "prev" && offset > 0) {
        setOffset((prevOffset) => prevOffset - limit);
      } else if (direction === "next" && offset + limit < totalUser) {
        setOffset((prevOffset) => prevOffset + limit);
      } else if (direction === "doublePrev") {
        setOffset(0);
      } else if (direction === "doubleNext") {
        setOffset(limit * (isPage - 1));
      }
    };
  };

  // 계정 승인
  const acctApproval = async (idx) => {
    await axios.patch(`http://192.168.23.65:5000/user/setlevel?idx=${idx}`);
    getUserInfo();
  };

  // 초기 데이터 로드
  useEffect(() => {
    getUserInfo();
  }, [offset]);

  useEffect(() => {
    if (!isModalOpen) {
      getUserInfo();
    }
  }, [isModalOpen]);

  return (
    <U.UserWrap>
      <Modal
        type="userList"
        mode="view"
        userIdx={userIdx}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <U.Title>
        <h2>계정관리</h2>
        <div>
          총 {totalUser}명, 승인대기 {newUser}명
        </div>
      </U.Title>
      <U.SearchBox>
        <input
          type="text"
          name="search"
          value={isSearch.search || ""}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <button onClick={onSearch}>계정검색</button>
      </U.SearchBox>
      <U.BlockTitle>
        <p>아이디</p>
        <p>이름</p>
        <p>소속</p>
        <p>권한레벨</p>
        <p>연락처</p>
        <p>메일</p>
      </U.BlockTitle>
      <U.Content $limit={limit}>
        {(isSearchMode ? isSearchList : isUserList).length > 0 ? (
          (isSearchMode ? isSearchList : isUserList).map((user) => (
            <U.Block
              key={user.idx}
              onClick={(e) => {
                setUserIdx(user.idx);
                setIsModalOpen(true);
              }}
            >
              <p>{user.id}</p>
              <p>{user.name || "이름"}</p>
              <p>{user.team || "소속팀"}</p>
              <p>
                {user.level < 2 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      acctApproval(user.idx);
                    }}
                  >
                    계정승인
                  </button>
                ) : (
                  <>{user.level}</>
                )}
              </p>
              <p>{user.tel || "010-0000-0000"}</p>
              <p>{user.eMail || "---@kbrainc.com"}</p>
            </U.Block>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </U.Content>
      {isPage > 1 && (
        <U.PageContainer>
          <DoublePrev onClick={handlePageBtn("doublePrev")} />
          <Prev onClick={handlePageBtn("prev")} />
          {Array.from({ length: isPage }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => {
                setOffset(limit * (pageNumber - 1));
              }}
              className={offset / limit === pageNumber - 1 ? "active" : ""}
            >
              {pageNumber}
            </button>
          ))}
          <Next onClick={handlePageBtn("next")} />
          <DoubleNext onClick={handlePageBtn("doubleNext")} />
        </U.PageContainer>
      )}
    </U.UserWrap>
  );
};

export default UserList;
