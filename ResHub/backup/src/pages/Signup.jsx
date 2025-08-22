import React, { useEffect, useState } from "react";
import axios from "axios";
import S from "../styled/GlobalBlock";
import L from "../styled/LoginStyled.jsx";

const Signup = ({ setShowSignup }) => {
  const [data, setData] = useState({ id: "", password: "" });
  const [pwCheck, setPwCheck] = useState("");
  const [idCheck, setIdCheck] = useState(null);
  const [notMatch, setNotMatch] = useState(false);
  const { id, password, username } = data;

  const API_URL = "http://192.168.23.2:5100/auth";

  const checkUserId = async () => {
    if (data.id.length == 0) {
      alert("ID를 입력하세요.");
      return;
    }
    await axios
      .get(`${API_URL}/signup?id=${data.id}`)
      .then((res) => {
        if (res.data.result === 0) {
          setIdCheck(true);
        } else {
          setIdCheck(false);
        }
      });
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "pwCheck") {
      setPwCheck(value); // pwCheck 상태 업데이트
      setNotMatch(value !== data.password); // 비밀번호와 일치 여부 확인
    } else {
      const nextData = { ...data, [name]: value };
      setData(nextData);

      // 비밀번호를 수정할 경우, 비밀번호 확인 상태 초기화
      name === "password" && setNotMatch(value !== pwCheck); // 비밀번호와 pwCheck 비교
    }
  };

  const onSubmit = async () => {
    if (idCheck === null) {
      alert("아이디 중복 체크를 진행하세요.");
      return;
    }
    if (!idCheck) {
      alert("중복된 아이디입니다. 다른 아이디를 입력하세요.");
      return;
    }
    if (!data.id || !data.password) {
      alert("모든 입력값을 입력해주세요.");
      return;
    }
    if (notMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    await axios.post("http://192.168.23.2:5100/auth/signup", data).then(() => {
      alert("회원가입 완료");
      setShowSignup(false);
    });
    setIdCheck(null);
  };

  return (
    <L.Container>
      <L.Logo onClick={() => document.location.href = "/"}>
        <h1>K·Brain</h1>
        <span>Projects Link & data</span>
      </L.Logo>

      <L.Group>
        <label>
          아이디
          {idCheck === true && (
            <span style={{ color: "green" }}>* 사용 가능한 아이디입니다.</span>
          )}
          {idCheck === false && (
            <span style={{ color: "red" }}>* 중복 아이디입니다.</span>
          )}
        </label>

        <L.Inner as="div">
          <L.Input type="text" name="id" value={id} onChange={onChange} />
          <S.Button theme="light" onClick={checkUserId}>
            중복확인
          </S.Button>
        </L.Inner>
      </L.Group>

      <L.Group>
        <label>비밀번호</label>
        <L.Input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
        />
      </L.Group>

      <L.Group>
        <label>
          비밀번호 확인
          {notMatch && (
            <span style={{ color: "red" }}>
              * 비밀번호가 일치하지 않습니다.
            </span>
          )}
        </label>
        <L.Input
          type="password"
          name="pwCheck"
          value={pwCheck}
          onChange={onChange}
        />
      </L.Group>

      <L.Group>
        <label>이름</label>
        <L.Input type="text" name="name" value={username} onChange={onChange} />
      </L.Group>

      <L.LoginBtn theme="light" onClick={onSubmit}>
        가입하기
      </L.LoginBtn>
    </L.Container>
  );
};

export default Signup;
