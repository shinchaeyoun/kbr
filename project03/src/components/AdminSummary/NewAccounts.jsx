// 신규 가입 계정
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import axios from "axios";

const Block = styled(S.Block)`
  position: relative;

  button {
    position: absolute;
        right: 10px;
    bottom: 10px;
  }
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;

  div {
    margin-left: 10px;
    color: #999;
    font-size: 12px;
  }
`;

const NewAccounts = () => {
  const navigate = useNavigate();

  const [totalList, setTotalList] = useState([]);
  const [list, setList] = useState([]);

  const getAccount = async () => {
    await axios.get(`http://192.168.23.65:5000/user/list`).then((res) => {
      setTotalList(res.data);
    });
    await axios
      .get(`http://192.168.23.65:5000/user/list?limit=5`)
      .then((res) => {
        setList(res.data);
      });
  };

  const moveToDetail = (idx) => {
    const index = totalList.findIndex((item) => item.idx === idx);
    navigate(`/admin/userlist/${index}`);
  };

  const moveToList = () => {
    navigate('/admin/userlist');
  }

  useEffect(() => {
    getAccount();
  }, []);

  return (
    <Block>
      <Title>
        신규가입계정<div>총 계정 수 {totalList.length}개</div>
      </Title>

      {list.map((item, idx) => (
        <li key={idx} onClick={() => moveToDetail(item.idx)}>
          {idx + 1} 아이디 : {item.id}
        </li>
      ))}

      <button onClick={moveToList}>계정 전체보기</button>
    </Block>
  );
};

export default NewAccounts;
