import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

const Block = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  border: 1px solid #999;
  margin-bottom: 10px;
  padding: 0 10px;

  gap: 0 20px;

  p::after {
    content: "|";
    padding-left: 20px;
    color: #ccc;
  }
`;

const UserList = (props) => {
  const navigate = useNavigate();

  const [isUserList, setUserList] = useState([]);
  const [isSearch, setSearch] = useState("");
  const { search } = isSearch;
  const [searchMsg, setSearchMsg] = useState("");

  const getUserInfo = async () => {
    await axios.get("http://192.168.23.2:5000/user/list").then((res) => {
      console.log('res==============',res);
      
      setUserList(res.data);
    });
  };

  const moveToDetail = (idx, e) => {
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
    await axios
      .post(`http://192.168.23.2:5000/user/search`, isSearch)
      // .then((res) => setUserList(res.data));
      .then((res) => {
        console.log(res.data.msg);
        setSearchMsg(res.data.msg);
        setUserList(res.data.result);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  // 계정 승인
  const acctApproval = async (idx, e) => {
    await axios.patch(`http://192.168.23.2:5000/user/setlevel?idx=${idx}`);
    // await fetchUserList();
    // navigate("/admin/userlist");
    // getUserInfo();
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  console.log('isUserList ------',isUserList);
  
  return (
    <>
      <div className="userSearch">
        <input
          type="text"
          name="search"
          value={search || ""}
          onChange={onChange}
          onKeyDown={handleKeyPress}
        />
        <button onClick={onSearch}>검색</button>
      </div>

      <div>{searchMsg}</div>

      {isUserList.map((user, idx) => {
        return (
          <Block
            key={user.idx}
            onClick={(e) => {
              moveToDetail(user.idx, e);
            }}
          >
            <S.FlexBox>
              <p>아이디 : {user.id}</p>
              <p>레벨 : {user.level}</p>
              <p>이름 : {user.name}</p>
              <p>팀 : {user.team}</p>
              <p>번호 : {user.tel}</p>
              <p>메일 : {user.eMail}</p>
              {/* <p>etc1 : {user.etc1}</p>
              <p>etc2 : {user.etc2}</p>
              <p>etc3 : {user.etc3}</p> */}
            </S.FlexBox>

            {user.level < 2 ? (
              <button
                onClick={() => {
                  acctApproval(user.idx);
                }}
              >
                계정승인
              </button>
            ) : (
              <></>
            )}
          </Block>
        );
      })}
    </>
  );
};

export default UserList;
