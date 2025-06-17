import React, { useState } from "react";
import axios from "axios";
import S from "../styled/GlobalBlock";
import L from "../styled/LoginStyled.jsx";

const Login = ({ isLogin, onSignupClick }) => {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [inputAt, setInputAt] = useState("");

  const handleInputId = (e) => setInputId(e.target.value);
  const handleInputPw = (e) => setInputPw(e.target.value);
  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    document.location.href = "/";
  };

  const onClickLogin = () => {
    axios
      .post("http://192.168.23.2:5001/auth/login", {
        id: inputId,
        password: inputPw,
        level: inputAt,
      })
      .then((res) => {
        if (res.data.userId === undefined) {
          // id 일치하지 않는 경우 userId = undefined, msg = '입력하신 id 가 일치하지 않습니다.'
          alert("입력하신 id 가 일치하지 않습니다.");
        } else if (res.data.userId === null) {
          // id는 있지만, pw 는 다른 경우 userId = null , msg = undefined
          alert("입력하신 비밀번호 가 일치하지 않습니다.");
        } else if (res.data.userId === inputId) {
          // id, pw 모두 일치 userId = userId1, msg = undefined
          localStorage.setItem("userId", inputId);
          if (res.data.userAuth !== null) {
            localStorage.setItem("level", res.data.userAuth);
          }
          // 작업 완료 되면 페이지 이동(새로고침)
          document.location.href = "/";
        }
      })
      .catch((err) => {
        console.error("err:", err.message);
      });
  };

  const enterLogin = (e) => {
    if (e.key === "Enter") {
      if (inputId !== "" && inputPw !== "") onClickLogin();
    }
  };

  return (
    <>
      {isLogin ? (
        <>
          <button type="button" onClick={onLogout}>
            logout
          </button>
        </>
      ) : (
        <L.Container>
          <L.Logo>
            <h1>K·Brain</h1>
            <span>Projects Link & data</span>
          </L.Logo>

          <L.Group>
            <L.Input
              type="text"
              name="id"
              value={inputId}
              placeholder="아이디"
              onChange={handleInputId}
              onKeyDown={enterLogin}
            />
          </L.Group>
          <L.Group>
            <L.Input
              type="password"
              name="password"
              value={inputPw}
              placeholder="비밀번호"
              onChange={handleInputPw}
              onKeyDown={enterLogin}
            />
          </L.Group>

          <S.ButtonWrap>
            <L.LoginBtn theme="light" type="button" onClick={onClickLogin}>
              로그인
            </L.LoginBtn>

            <L.SignupBtn $signup="true"type="button" onClick={onSignupClick}>
              회원가입
            </L.SignupBtn>
          </S.ButtonWrap>
        </L.Container>
      )}
    </>
  );
};

export default Login;
