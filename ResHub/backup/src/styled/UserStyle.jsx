//UserStyle
import styled from "styled-components";
import S from "./GlobalBlock";
import M from "./ModalStyled.jsx";
import media from "./media.jsx";

const Select = styled.select`
  width: 100%;
  border: none;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;

  margin: 20px 0 0;
  width: 100%;

  button {
    padding: 3px 10px;
    border: 1px solid #555;
    border-radius: 5px;
    background-color: #aaa;
    color: #fff;
    font-size: 16px;

    &.active {
      background-color: #555555;
      border: 1px solid #aaa;
      color: #fff;
    }
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;

const SearchBox = styled.div`
  position: absolute;
  top: -5px;
  right: 0;

  width: 252px;
  height: 34px;

  border: 1px solid #999;
  border-radius: 7px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0 10px;
  padding: 0 10px;

  input {
    flex: 1;
    width: 60%;
    height: 100%;

    border: none;
    border-radius: 7px;

    font-size: 14px;
    font-weight: 300;
    color: #333;

    &:focus {
      outline: none;
    }
  }

  button {
    padding: 3px 12px;
    flex-shrink: 1;
    background-color: #555555;
    color: #fff;
    border: none;
    border-radius: 5px;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 5px;
  font-size: 18px;
  font-weight: bold;

  div {
    margin-left: 10px;
    color: #777;
    font-weight: 300;
    font-size: 12px;
  }
`;

const Box = styled.div`
  height: 100%;
  text-align: center;
  align-content: center;
`;

const Block = styled.div`
  min-height: 45px;

  display: grid;
  grid-template-columns: repeat(5, 1fr) 2fr;
  align-items: center;
  text-align: center;

  border-bottom: 1px solid #999;

  span {
    position: absolute;
    left: 0;
    font-size: 10px;
    color: #aaa;
  }
  p {
    padding: 8px 0;

    &:last-child {
      
    }

    &.hide {
      display: none;
    }
    

  }

  button {
    border: 1px solid #aaa;
    border-radius: 5px;
    background-color: #555;
    color: #fff;
    padding: 3px 10px;
  }


  ${({ $isTab }) =>
    $isTab &&
    `
      grid-template-columns: repeat(3, 1fr);
    `}







`;

const Content = styled.div`
  
`;

const BlockTitle = styled(Block)`
  color: #fff;
  background-color: #555555;
  border: 1px solid #aaaaaa;

  p {
    padding: 7px 0;
    border-right: 1px solid #aaaaaa;

    &:last-child {
      border: none;
    }
  }
`;

const Wrap = styled(M.Wrap)`
  ${M.GridItem} {
    span {
      font-size: 12px;
    }
  }
  ${M.Button} {
    background-color: #555555;
  }
`;

const UserWrap = styled.div`
  position: relative;
  width: 945px;
  margin: 0 auto;

  ${media.tab`
    width: 100%;
  `}

  ${media.mbl`
    width: 100%;

    ${Title} {
      margin-bottom: 50px;
    }
    ${SearchBox} {
      position: absolute;
      top: 35px;
      left: 0;
      width: 100%;
    }
  `}
`;

const U = {
  Select,
  PageContainer,
  SearchBox,
  Title,
  Box,
  Block,
  Content,
  BlockTitle,
  Wrap,
  UserWrap,
};

export default U;
