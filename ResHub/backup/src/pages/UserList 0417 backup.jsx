import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import U from "../styled/UserStyle.jsx";
import axios from "axios";

import Modal from "../components/Modal.jsx";

import DoublePrev from "../assets/icon/double-prev-arrow.svg?react";
import Prev from "../assets/icon/prev-arrow.svg?react";
import Next from "../assets/icon/next-arrow.svg?react";
import DoubleNext from "../assets/icon/double-next-arrow.svg?react";

const UserList = (props) => {
  const navigate = useNavigate();
  const [totalUser, setTotalUser] = useState([]);
  const [newUser, setNewUser] = useState(0);
  const [isUserList, setIsUserList] = useState([]);
  const [isSearchList, setIsSearchList] = useState([]);
  const [isSearchMode, setSearchMode] = useState(false);
  const [isNewUserList, setNewUserList] = useState([]);
  const [isSearch, setSearch] = useState({ search: "" });
  const [searchMsg, setSearchMsg] = useState("");
  const { search } = isSearch;
  const limit = 10; // 한 번에 가져올 데이터 수
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isPage, setPage] = useState(0);
  const [userIdx, setUserIdx] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 초기 셋팅, 페이지 로딩 시 작동
  const setUserList = async () => {
    await axios
      .get(`http://192.168.23.2:5100/user/list`, { params: { limit, offset } })
      .then((res) => {
        setTotalUser(res.data.totalCount);
        setNewUser(res.data.lowLevelCount);

        // setHasMore(res.data.totalCount > offset + limit); // 더 가져올 데이터가 있는지 확인
        setIsUserList(res.data.userList); // 기존 데이터에 추가
        setPage(Math.ceil(res.data.totalCount / limit)); // 페이지 수 계산
        // offset === 0 && setOffset(limit);
      })
      .catch((err) => {
        console.error("데이터를 가져오는 중 오류 발생:", err);
      });
  };

  const getUserInfo = async () => {
    await axios
      .get(`http://192.168.23.2:5100/user/list`, { params: { limit, offset } })
      .then((res) => {
        // setHasMore(res.data.totalCount > offset + limit); // 더 가져올 데이터가 있는지 확인
        setIsUserList(res.data.userList); // 기존 데이터에 추가
        // offset === 0 && setOffset(limit);
      })
      .catch((err) => {
        console.error("데이터를 가져오는 중 오류 발생:", err);
      });
  };

  // 더보기 버튼 클릭
  const moreList = () => {
    setOffset((prevOffset) => prevOffset + limit); // offset 증가
    getUserInfo(); // 새로운 offset으로 데이터 요청
  };

  // 페이지 버튼 클릭 핸들러
  const handlePageBtn = (direction) => {
    return () => {
      if (direction === "prev") {
        if (offset === 0) return; // 처음 페이지에서 이전 버튼 클릭 방지
        setOffset((prevOffset) => prevOffset - limit);
      } else if (direction === "next") {
        if (offset + limit >= totalUser) return; // 마지막 페이지에서 다음 버튼 클릭 방지
        setOffset((prevOffset) => prevOffset + limit);
      } else if (direction === "doublePrev") {
        if (offset === 0) return; // 처음 페이지에서 이전 버튼 클릭 방지
        setOffset(0);
      } else if (direction === "doubleNext") {
        if (offset + limit >= totalUser) return; // 마지막 페이지에서 다음 버튼 클릭 방지
        setOffset(limit * isPage - limit);
      }

      getUserInfo();
    };
  };

  const moveToDetail = (idx, e) => {
    setIsModalOpen(true);
    const index = isUserList.findIndex((item) => item.idx === idx);
    navigate(`/admin/userlist/${index}`);
  };

  const onChange = (e) => {
    const { value, name } = e.target;
    setSearch({
      ...isSearch,
      [name]: value,
    });
  };

  const onSearch = async () => {
    setSearchMode(true);
    await axios
      // .post(`http://192.168.23.2:5100/user/search`, isSearch)
      .post(`http://192.168.23.2:5100/user/search`, {
        limit,
        offset,
        isSearch,
      })
      .then((res) => {
        console.log(
          "res.data.result.length",
          res.data.totalCount,
          offset + limit
        );

        setHasMore(res.data.totalCount > offset + limit);
        setSearchMsg(res.data.msg);
        setIsSearchList(res.data.searchResult);
        // setListLength(res.data.result.length);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  // 계정 승인
  const acctApproval = async (idx) => {
    // 클릭 이벤트 전파 방지
    await axios.patch(`http://192.168.23.2:5100/user/setlevel?idx=${idx}`);
    // await fetchUserList();
    // navigate("/admin/userlist");
    getUserInfo();
  };

  useEffect(() => {
    getUserInfo();
  }, [offset]);

  useEffect(() => {
    setIsUserList([]);
    setOffset(0);
    // getUserInfo();
    setUserList();
  }, []);

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
        // itemIdx={isBoardIdx}
        userIdx={userIdx}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        // onModalClose={onModalClose}
        // level={level}
        // isEmptyLink={isEmptyLink}
        // setIsEmptyLink={setIsEmptyLink}
      />
      <U.Title>
        <h2>계정관리</h2>
        <div>
          총 {totalUser}명, 승인대기 {newUser}명
        </div>
      </U.Title>
      <U.SearchBox className="userSearch">
        <input
          type="text"
          name="search"
          value={search || ""}
          onChange={onChange}
          onKeyDown={handleKeyPress}
        />
        <button onClick={onSearch}>계정검색</button>
      </U.SearchBox>
      <div>{searchMsg}</div>
      {searchMsg == "" && (
        <>
          <U.BlockTitle>
            <p>아이디</p>
            <p>이름</p>
            <p>소속</p>
            <p>권한레벨</p>
            <p>연락처</p>
            <p>메일</p>
          </U.BlockTitle>
          <U.Content $limit={limit}>
            {isUserList.map((user, idx) => {
              return (
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
                  {/* <p>etc1 : {user.etc1}</p>
              <p>etc2 : {user.etc2}</p>
              <p>etc3 : {user.etc3}</p> */}
                </U.Block>
              );
            })}
          </U.Content>
          {totalUser} / {limit}
          {isUserList.length > limit && (
            <>
              {isUserList.length} / {limit}
            </>
          )}
          <U.PageContainer>
            <DoublePrev onClick={handlePageBtn("doublePrev")} />
            <Prev onClick={handlePageBtn("prev")} />
            {Array.from({ length: isPage }, (_, i) => i + 1).map(
              (pageNumber, index) => (
                <button
                  key={pageNumber}
                  onClick={() => {
                    setOffset(limit * (pageNumber - 1));
                  }}
                  className={offset / limit === index ? "active" : ""}
                >
                  {pageNumber} / {limit}
                </button>
              )
            )}
            <Next onClick={handlePageBtn("next")} />
            <DoubleNext onClick={handlePageBtn("doubleNext")} />
          </U.PageContainer>
          {hasMore && (
            <button theme="light" onClick={moreList}>
              더보기
            </button>
          )}
        </>
      )}
    </U.UserWrap>
  );
};

export default UserList;
