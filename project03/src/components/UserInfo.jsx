import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

const Block = styled.div`
  display: flex;
  border: 1px solid #999;
  margin-bottom: 10px;
  padding: 0 10px;

  gap: 0 20px;

  P::after {
  content: '|';
  padding-left: 20px;
  color: #ccc;
  }
`

const UserInfo = () => {
  const [isUserList, setUserList] = useState([]);

  const userInfo = async () => {
    await axios.get("http://192.168.23.65:5000/userinfo").then((res) => {
      console.log("user list page", res);

      setUserList(res.data);
    });
  };

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <>
      {isUserList.map((user) => {
        return (
          <Block key={user.idx}>
            <p>{user.id}</p>
            <p>{user.password}</p>
            <p>{user.level}</p>
            <p>{user.name}</p>
            <p>{user.team}</p>
            <p>{user.etc1}</p>
            <p>{user.etc2}</p>
            <p>{user.etc3}</p>
          </Block>
        );
      })}
    </>
  );
};

export default UserInfo;
