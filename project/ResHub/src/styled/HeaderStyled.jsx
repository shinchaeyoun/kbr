// HeaderStyled.jsx
import styled from "styled-components";

const HeaderContainer = styled.header`
  padding: 30px 0;
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

const SearchBox = styled.div`
  display: flex;
  align-items: center;

  padding: 0 10px;

  width: 600px;
  height: 50px;
  
  
  border: 3px solid #ddd;
  border-radius: 8px;
  
  overflow: hidden;
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;

  margin-left: 10px;
`;

const H = {
  HeaderContainer,
  HeaderTitle,
  SearchBox,
  Input
};

export default H;
