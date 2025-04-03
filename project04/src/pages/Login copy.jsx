import React, { useState } from "react";
import axios from "axios";
import S from "../styled/GlobalBlock.jsx";

const Login = ({ isLogin, onSighupClick }) => {
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };
  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };

  const onLogout = () => {
    localStorage.removeItem("level");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  const onClickLogin = () => {
    console.log("ID : ", inputId);
    console.log("PW : ", inputPw);

    axios
      .post("http://192.168.23.65:5000/auth/login", {
        id: inputId,
        password: inputPw,
        level: inputAt,
      })
      .then((res) => {
        console.log("res.data ===", res.data);
        console.log("res.data.userId ===", res.data.userId);
        console.log("res.data.msg :: ", res.data.msg);

        if (res.data.userId === undefined) {
          // id 일치하지 않는 경우 userId = undefined, msg = '입력하신 id 가 일치하지 않습니다.'
          console.log("======================", res.data.msg);
          alert("입력하신 id 가 일치하지 않습니다.");
        } else if (res.data.userId === null) {
          // id는 있지만, pw 는 다른 경우 userId = null , msg = undefined
          console.log(
            "======================",
            "입력하신 비밀번호 가 일치하지 않습니다."
          );
          alert("입력하신 비밀번호 가 일치하지 않습니다.");
        } else if (res.data.userId === inputId) {
          // id, pw 모두 일치 userId = userId1, msg = undefined
          console.log("======================", "로그인 성공", res.data);
          localStorage.setItem("userId", inputId);

          console.log("localStorage.userId :", localStorage.userId);

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

  const enterLogin = async () => {
    if (e.key === "Enter") {
      if (inputId !== "" && inputPw !== "") {
        onClickLogin();
      }
    }
  };

  return (
    <>
      {isLogin ? (
        <S.LogoutContainer>
          <S.LogoutButton onClick={onLogout}>로그아웃</S.LogoutButton>
        </S.LogoutContainer>
      ) : (
        <S.LoginContainer>
          <S.LoginInput
            name="id"
            type="text"
            value={inputId}
            placeholder="아이디"
            onChange={handleInputId}
            onKeyPress={enterLogin}
          />
          <S.LoginInput
            name="password"
            type="password"
            value={inputPw}
            placeholder="비밀번호"
            onChange={handleInputPw}
            onKeyPress={enterLogin}
          />
          <S.LoginButton type="button" onClick={onClickLogin}>
            로그인
          </S.LoginButton>
          <S.SignupButton type="button" onClick={onSighupClick}>
            회원가입
          </S.SignupButton>
        </S.LoginContainer>
      )}
    </>
  );
};

export default Login;
