// HeaderStyled.jsx
import styled from "styled-components";

const HeaderContainer = styled.header`
  padding-top: 97px;
  padding-bottom: 30px;
`;

const HeaderTitle = styled.h1`
  font-family: "NanumSquareNeoHeavy", sans-serif;
  font-size: 20px;

  span {
    display: inline-block;
    margin-left: 4px;
    font-family: "Orbit-Regular", sans-serif;
    font-size: 11px;
    letter-spacing: -0.6px;
  }
`;

const H = {
  HeaderContainer,
  HeaderTitle,
};

export default H;
