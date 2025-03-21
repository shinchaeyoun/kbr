import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ isLogin, onSignupClick }) => {
  const navigate = useNavigate();

  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [inputAt, setInputAt] = useState("");

  const handleInputId = (e) => {
    setInputId(e.target.value);
  };

  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };

  const onLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_lvl");
    document.location.href = "/";
  };

  const onClickLogin = () => {
    console.log("ID : ", inputId);
    console.log("PW : ", inputPw);

    axios
      .post("http://192.168.23.65:5000/login", {
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
          sessionStorage.setItem("user_id", inputId);

          console.log("sessionStorage.user_id :", sessionStorage.user_id);

          if (res.data.userAuth !== null) {
            sessionStorage.setItem("user_lvl", res.data.userAuth);
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
      console.log(
        "엔터 == 아이디 인풋 값과 패스워드 인풋 값 채워져있는지 확인"
      );
      // getDataList();

      if (inputId !== "" && inputPw !== "") {
        console.log("값 입력 완");
        onClickLogin();
      } else {
        console.log("inputId,inputPw===", inputId == "", inputPw == "");
      }
    }
  };

  const moveToSignup = () => {
    navigate("/signup");
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
