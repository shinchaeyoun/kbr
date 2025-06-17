import React, { useEffect, useState } from "react";
import H from "../styled/HeaderStyled";
import S from "../styled/GlobalBlock";

const Header = ({setShowSignup}) => {
  const [isLogin, setIsLogin] = useState(false);


  // 로그아웃웃
  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    setIsLogin(false);
    document.location.href = "/";
  };

  // 로그인
  const onLogin = () => {
    setShowSignup(false)
  };

  // 로고 클릭시 새로고침침
  const onLogo = () => {
    setShowSignup(false);
    document.location.href = "/";
  };

  // 로그인 상태 확인
  useEffect(() => {
    const level = localStorage.getItem("level");
    setIsLogin(level !== null);
  }, []);

  return (
    <H.HeaderContainer>
      <H.HeaderTitle onClick={onLogo}>
        K·Brain<span>Projects Link & data</span>
      </H.HeaderTitle>

      {isLogin ? (
        <S.Button className="logout" onClick={onLogout}>
          로그아웃
        </S.Button>
      ) : (
        <S.Button className="login" onClick={onLogin}>
          로그인
        </S.Button>
      )}
    </H.HeaderContainer>
  );
};

export default Header;
