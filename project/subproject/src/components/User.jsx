import React, { useState, useEffect } from "react";
import S from "../styled/GlobalBlock.jsx";
import M from "../styled/ModalStyled.jsx";
import U from "../styled/UserStyle.jsx";
import axios from "axios";

// svg
import PasswordShow from "../assets/icon/password-show.svg?react";
import PasswordHide from "../assets/icon/password-hide.svg?react";

const User = (props) => {
  const { idx, setIsModalOpen } = props;
  const [user, setUser] = useState({
    id: null,
    password: null,
    level: null,
    name: null,
    team: null,
    tel: null,
    email: null,
    etc1: null,
    etc2: null,
    etc3: null,
  });
  const { id, password, level, name, team, tel, email, etc1, etc2, etc3 } =
    user;

  const [pwCheck, setPwCheck] = useState("");
  const [notMatch, setNotMatch] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState("password"); // 비밀번호 입력 타입 상태

  const getUserInfo = async () => {
    const resp = await axios.get(`http://192.168.23.2:5000/user?idx=${idx}`);
    setUser(resp.data);
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === "pwCheck") {
      setPwCheck(value); // pwCheck 상태 업데이트
      setNotMatch(value !== user.password); // 비밀번호와 일치 여부 확인
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));

      // 비밀번호를 수정할 경우, 비밀번호 확인 상태 초기화
      name === "password" && setNotMatch(value !== pwCheck); // 비밀번호와 pwCheck 비교
    }
  };

  const handleLevelChange = (newLevel, index) => {
    setUser((user) => ({
      ...user,
      level: newLevel,
    }));
  };

  const handleSubmit = async () => {
    if (notMatch) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    await axios
      .patch(`http://192.168.23.2:5000/user/update?idx=${idx}`, user)
      .then((res) => {
        alert("수정되었습니다.");
        setIsModalOpen(false);
      });
  };

  const userDelete = async () => {
    const deletConfirm = confirm("삭제 하시겠습니까?");

    if (deletConfirm) {
      await axios
        .delete(`http://192.168.23.2:5000/user/delete?idx=${idx}`, user)
        .then((res) => {
          alert("삭제되었습니다.");
          setIsModalOpen(false);
        });
    }
  };

  const handleCancel = () => setIsModalOpen(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <U.Wrap>
      <M.Title>계정정보</M.Title>
      <M.GridItem>
        <M.SubTitle>아이디</M.SubTitle>
        <M.Input type="text" name="id" value={id || ""} onChange={onChange} />
      </M.GridItem>
      <M.GridItem>
        <M.SubTitle>이름</M.SubTitle>
        <M.Input
          type="text"
          name="name"
          value={name || ""}
          onChange={onChange}
        />
      </M.GridItem>
      <M.GridItem>
        <M.SubTitle>소속팀</M.SubTitle>
        <M.Input
          type="text"
          name="team"
          value={team || ""}
          onChange={onChange}
        />
      </M.GridItem>
      <M.GridItem>
        <M.SubTitle>권한레벨</M.SubTitle>
        <M.Group>
          <U.Select
            name="level"
            id="level"
            value={level || ""} // 현재 레벨 값을 선택된 값으로 설정, null일 경우 빈 문자열로 대체
            onChange={(e) => handleLevelChange(e.target.value, props.idx)} // 변경 시 이벤트 핸들링
          >
            <option value="1">1: 게스트</option>
            <option value="2">2: 멤버</option>
            <option value="3">3: 매니저</option>
            <option value="9">9: 관리자</option>
          </U.Select>
        </M.Group>
      </M.GridItem>
      <M.GridItem style={{ position: "relative" }}>
        <M.SubTitle>비밀번호 수정</M.SubTitle>
        {/* <M.Input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
        />
        <span onClick={}>qhrl</span> */}
        <M.Input
          type={passwordInputType}
          name="password"
          value={password || ""}
          onChange={onChange}
        />
        <S.AbsoluteBtn
          style={{ right: 0, top: "31px" }}
          onClick={() =>
            setPasswordInputType((prevType) =>
              prevType === "password" ? "text" : "password"
            )
          }
        >
          {passwordInputType === "password" ? (
            <PasswordShow width="25px" height="25px" />
          ) : (
            <PasswordHide width="25px" height="25px" />
          )}
        </S.AbsoluteBtn>
      </M.GridItem>
      <M.GridItem>
        <M.SubTitle>비밀번호 수정 확인</M.SubTitle>
        <M.Input
          type={passwordInputType}
          name="pwCheck"
          value={pwCheck || ""}
          onChange={onChange}
        />
        {notMatch && (
          <span style={{ color: "red" }}>* 비밀번호가 일치하지 않습니다.</span>
        )}
      </M.GridItem>

      <M.Button onClick={handleSubmit}>계정수정</M.Button>
      <M.DeleteBtn onClick={userDelete}>삭제하기</M.DeleteBtn>
      <M.CloseBtn onClick={handleCancel}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          strokeWidth={2}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L29 29" stroke="black" />
          <path d="M29 1L1 29" stroke="black" />
        </svg>
      </M.CloseBtn>
    </U.Wrap>
  );
};

export default User;
