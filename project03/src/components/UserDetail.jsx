import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

//components
import User from "../components/User.jsx";


const UserDetail = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const { idx } = useParams();

  const [user, setUser] = useState({});
  const fields = [
    { label: "아이디", value: user.id },
    { label: "레벨", value: user.level },
    { label: "이름", value: user.name },
    { label: "팀", value: user.team },
    { label: "번호", value: user.tel },
    { label: "메일", value: user.eMail },
    { label: "etc1", value: user.etc1 },
    { label: "etc2", value: user.etc2 },
    { label: "etc3", value: user.etc3 },
  ];

  const getUserInfo = async () => {
    const resp = await (
      await axios.get(`http://192.168.23.65:5000/userlist/`)
    ).data[idx];

    console.log("resp", resp);

    setUser(resp);
  };

  const onChange = (e) => {
    const { value, name } = e.target;
    console.log("value", value, "value, name", name);

    // setBoard({
    //   ...board,
    //   [name]: value,
    // });
  };

  const handleSubmit = () => {
    setIsUpdate(!isUpdate);

    if (isUpdate) {
      // 수정 로직
      console.log('저장 완료');
      
    } else {
      // 작성 로직
      console.log('수정 페이지');
      
    }

  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      {/* <User
        id={user.id}
        level={user.level}
        name={user.name}
        team={user.team}
        tel={user.tel}
        eMail={user.eMail}
        etc1={user.etc1}
        etc2={user.etc2}
        etc3={user.etc3}
        isUpdate={isUpdate}
      /> */}
      {isUpdate ? (
        <>
          updateMode
          {fields.map((field, index) => (
            <p key={index}>
              {field.label} :{" "}
              <input type="text" value={field.value} onChange={onChange} />
            </p>
          ))}
        </>
      ) : (
        <>
          updateMode not
          {fields.map((field, index) => (
            <p key={index}>
              {field.label} : <input type="text" value={field.value} readOnly />
            </p>
          ))}
        </>
      )}

      <button onClick={handleSubmit}>
        {isUpdate ? "저장하기" : "수정하기"}
      </button>

    </>
  );
};

export default UserDetail;
