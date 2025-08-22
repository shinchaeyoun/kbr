import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import H from "../styled/HeaderStyled";
import S from "../styled/GlobalBlock";

import SearchIcon from "../assets/icon/search.svg?react";
import axios from "axios";

const Header = ({ setShowSignup }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(false);
  const [level, setLevel] = useState(localStorage.getItem("level"));
  const [searchTerm, setSearchTerm] = useState("");

  // 로그아웃 함수
  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    setIsLogin(false); // 상태 업데이트
    document.location.href = "/";
  };

  // 로그인 함수
  const onLogin = () => setShowSignup(false);
  const onLogo = () => {
    setShowSignup(false);
    document.location.href = "/";
  };

  // 검색 함수
  const handleSearch = () => {
    // console.log('searchTerm.trim()',searchTerm.trim());
    
    if (searchTerm.trim()) {
      // 검색어가 있으면 search 파라미터 설정
      // setSearchParams({ search: searchTerm.trim() });
      // navigate("/search");
      navigate(`/search?search=${searchTerm.trim()}`); // 메인 페이지로 이동
    } else {
      // 검색어가 없으면 전체 목록으로
      // setSearchParams({});
      navigate("/");
    }
  };

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 로그인 상태 확인
  useEffect(() => setIsLogin(level !== null), []);

  return (
    <H.HeaderContainer>
      <H.HeaderTitle onClick={onLogo}>
        K·Brain<span>Projects Link & data</span>
      </H.HeaderTitle>

      {isLogin ? (
        <>
          <H.SearchBox>
            <H.Input
              placeholder="제목, 태그로 검색하세요"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={keyDownHandler}
            />
            <SearchIcon width="20px" height="20px" onClick={handleSearch} />
          </H.SearchBox>

          <S.ButtonWrap direction="row">
            <S.Button className="logout" onClick={onLogout}>
              로그아웃
            </S.Button>

            {level === "admin" && (
              <>
                <S.Button onClick={() => navigate("/admin")}>관리자</S.Button>
              </>
            )}
          </S.ButtonWrap>
        </>
      ) : (
        <S.Button className="login" onClick={onLogin}>
          로그인
        </S.Button>
      )}
    </H.HeaderContainer>
  );
};

export default Header;
