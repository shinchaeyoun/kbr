import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import H from "../styled/HeaderStyled.jsx";
import S from "../styled/GlobalBlock.jsx";

const Header = ({ setShowSignup }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [level, setLevel] = useState(localStorage.getItem("level"));

  // 로그아웃 함수
  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    setIsLogin(false); // 상태 업데이트
    document.location.href = "/";
  };

  // 로그인 함수
  const onLogin = () => {
    setShowSignup(false);
  };

  const onLogo = () => {
    setShowSignup(false);
    document.location.href = "/";
  };

  // 로그인 상태 확인
  useEffect(() => {
    setIsLogin(level !== null); // level 값이 있으면 로그인 상태로 설정
  }, []);

  return (
    <H.HeaderContainer>
      <H.HeaderTitle onClick={onLogo}>
        K·Brain<span>Projects Link & data</span>
      </H.HeaderTitle>

      {isLogin ? (
        <S.ButtonWrap direction="row">
          <S.Button className="logout" onClick={onLogout}>
            로그아웃
          </S.Button>

          {level === "9" && (
            <S.Button onClick={() => navigate("/admin")}>관리자</S.Button>
          )}
        </S.ButtonWrap>
      ) : (
        <S.Button className="login" onClick={onLogin}>
          로그인
        </S.Button>
      )}
    </H.HeaderContainer>
  );
};

export default Header;
