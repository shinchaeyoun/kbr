import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Block = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 10px;
  border: 1px solid #999;
  div {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 0 20px;
    p::after {
      content: "|";
      padding-left: 20px;
      color: #ccc;
    }
  }
`;

const UserMgmt = () => {
  const [isUserList, setUserList] = useState([]);

  // 사용자 목록 가져오기
  const fetchUserList = async () => {
    const resp = await (
      await axios.get(`http://192.168.23.65:5000/user/list`)
    ).data;

    const filteredUsers = resp.filter((user) => user.level === 1);
    setUserList(filteredUsers);
  };

  // 계정 승인
  const acctApproval = async (idx, e) => {
    await axios.patch(`http://192.168.23.65:5000/user/setlevel?idx=${idx}`);
    await fetchUserList();
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      {isUserList.map((user) => {
        return (
          <Block key={user.idx}>
            <div>
              <p>index : {user.idx}</p>
              <p>아이디 : {user.id}</p>
              <p>레벨 : {user.level}</p>
              <p>이름 : {user.name}</p>
              <p>팀 : {user.team}</p>
              <p>번호 : {user.tel}</p>
              <p>메일 : {user.eMail}</p>
              <p>etc1 : {user.etc1}</p>
              <p>etc2 : {user.etc2}</p>
              <p>etc3 : {user.etc3}</p>
            </div>
            <button
              onClick={() => {
                acctApproval(user.idx);
              }}
            >
              계정승인
            </button>
          </Block>
        );
      })}
    </>
  );
};

export default UserMgmt;
