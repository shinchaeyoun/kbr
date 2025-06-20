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
  grid-template-columns: repeat(
    ${(props) => props.$repeat || "auto-fill"},
    1fr
  );
  // grid-template-columns: 60px 100px 2fr 80px 120px 80px;
  justify-items: center;
  align-items: center;

  & > :nth-child(3) {
    width: 100%;
    text-align: left;
  }
`;

const TitleBlock = styled(Grid)`
  background-color: rgb(0, 75, 155);

  color: #fff;
  height: 35px;

  > p {
    text-align: center !important;
  }
`;

const Block = styled(Grid)`
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;

  p {
    width: 100%;
  }

  .title {
    display: flex;
    gap: 10px;
    padding-left: 10px;
    width: 500px;

    > span {
      flex-shrink: 0;
      color: #d0021b;
    }
  }

  .dateTime {
    width: 100%;
    text-align: right;
  }
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

const AttachmentIcon = styled(S.Button)`
  position: relative;
  border: none;
`;

const AttachmentPop = styled.div`
  position: absolute;
  left: 50%;

  display: block;

  min-width: 200px;
  max-width: 400px;
  width: fit-content;

  transform: translateX(-50%);

  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;

  font-family: initial;

  z-index: 1;
  cursor: default;
  box-sizing: border-box;
  word-break: break-all;
  overflow-wrap: anywhere;
  ul {
    margin: 0;
    padding: 0;
    li {
      align-items: center;
      display: flex;
      gap: 10px;

      margin: 10px;
      padding: 0px 10px;
      cursor: pointer;
      font-size: 16px;
      text-align: left;
      white-space: normal;
      max-width: 560px;
      box-sizing: border-box;
      overflow-wrap: anywhere;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      background-color: #fff;
      &:hover {
        color: #007bff;
      }
    }
  }
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
  AttachmentIcon,
  AttachmentPop,
};

export default L;
