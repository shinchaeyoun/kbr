import React, { useState } from "react";
import axios from "axios";

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
      .post("http://192.168.23.65:5000/auth/login", {
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
        <>
          <h1>로그인</h1>
          <label> ID 입력 :</label>
          <br />
          <input
            type="text"
            name="id"
            value={inputId}
            onChange={handleInputId}
            onKeyDown={enterLogin}
          />
          <br />
          <br />
          <label> password 입력 :</label>
          <br />
          <input
            type="password"
            name="password"
            value={inputPw}
            onChange={handleInputPw}
            onKeyDown={enterLogin}
          />
          <br />
          <br />
          <button type="button" onClick={onClickLogin}>
            로그인
          </button>

          <button type="button" onClick={onSignupClick}>
            회원가입
          </button>
        </>
      )}
    </>
  );
};

export default Login;
