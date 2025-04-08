import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import "../styled/header.css";
import H from "../styled/HeaderStyled";
import S from "../styled/GlobalBlock";

const Header = ({setShowSignup}) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

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
    navigate("/");
    setShowSignup(false);
  };

  // 로그인 상태 확인
  useEffect(() => {
    const level = localStorage.getItem("level");
    setIsLogin(level !== null); // level 값이 있으면 로그인 상태로 설정
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
