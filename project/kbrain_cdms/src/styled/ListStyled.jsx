//ListStyled
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const ListWrap = styled.div`
  position: relative;
  margin-top: 20px;
  width: 100%;
`;

const ListBlock = styled.div``;
const ListBlockWrap = styled.div``;

const ListBlockTitle = styled.ul`
  display: flex;
  justify-content: space-between;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  align-items: center;

  & > :nth-child(3) {
    min-width: 360px; /* 원하는 width로 조정 */
    // max-width: 400px;
    text-align: center;
  }
`;

const TitleBlock = styled(Grid)`
  background-color:rgb(0, 75, 155);
  
  color: #fff;
  height: 35px;
`;

const Block = styled(Grid)`
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const Button = styled(S.Button)`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const L = {
  ListWrap,
  ListBlock,
  ListBlockWrap,
  ListBlockTitle,
  Content,
  TitleBlock,
  Block,
  Button,
};

export default L;
