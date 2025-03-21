import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

//components
import User from "../components/User.jsx";

const UserDetail = () => {
    const navigate = useNavigate();
  
  const [isUpdate, setIsUpdate] = useState(false);
  const { idx } = useParams();

  // 유저 정보 상태 관리리
  const [user, setUser] = useState({
    id: null,
    level: null,
    name: null,
    team: null,
    tel: null,
    email: null,
    etc1: null,
    etc2: null,
    etc3: null,
  });

  // 필드 배열 생성
  const fields = [
    { label: "아이디", name: "id", value: user.id },
    { label: "레벨", name: "level", value: user.level },
    { label: "이름", name: "name", value: user.name },
    { label: "팀", name: "team", value: user.team },
    { label: "번호", name: "tel", value: user.tel },
    { label: "메일", name: "email", value: user.email },
    { label: "etc1", name: "etc1", value: user.etc1 },
    { label: "etc2", name: "etc2", value: user.etc2 },
    { label: "etc3", name: "etc3", value: user.etc3 },
  ];

  // const { id, level, name, team, tel, eMail, etc1, etc2, etc3 } = user;

  // 입력 필드 데이터 바인딩
  const onChange = (e) => {
    const { value, name } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const getUserInfo = async () => {
    const resp = await (
      await axios.get(`http://192.168.23.65:5000/userlist/`)
    ).data[idx];
    setUser(resp);
  };

  const handleSubmit = async () => {
    // const index = user.findIndex((item) => item.idx === idx);
    const index = user.idx;
console.log('user',index,idx);

    setIsUpdate(!isUpdate);

    if (isUpdate) {
      // 수정 로직
      console.log("저장 완료");

      await axios
        .patch(`http://192.168.23.65:5000/accountupdate?idx=${index}`, user)
        .then((res) => {
          console.log('=========res', res);
          
          // alert("수정되었습니다.");
          navigate("/admin/userlist");
        });
    } else {
      // 작성 로직
      console.log("수정 페이지");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      {fields.map((field, index) => (
        <div key={index}>
          {field.label} :
          <input
            type="text"
            name={field.name}
            value={field.value || ""}
            onChange={onChange}
            readOnly={!isUpdate}
          />
        </div>
      ))}

      <button onClick={handleSubmit}>
        {isUpdate ? "저장하기" : "수정하기"}
      </button>
    </>
  );
};

export default UserDetail;
