//CardStyled
import styled, {css} from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const CardWrapper = styled(S.Block)`
  width: 320px;
  height: 410px;
  border-radius: 8px;

  padding: 0;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f0f0f0;

  overflow: hidden;

  border-radius: 8px 8px 0 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 230px;
`;

const Block = styled(S.Block)`
  margin: 0;
  padding: 10px;
  height: 100%;
  border: none;

  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
    padding: 0 10px;
  }

  .description {
    color: #718096;
    background-color: #f7fafc;
  }

  ${(props) =>
    props.$type === "tag" &&
    css`
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      
      margin-bottom: 15px;
      height: auto;
    `}
`;

const Tag = styled.span`
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 5px 10px 5px 22px;
  position: relative;
  &::before {
    content: "#";
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    color: rgb(75, 144, 201);
  }
`;

const Attachment = styled.div`
  position: relative;
  border: none;
`;

const AttachmentPop = styled.div`
  position: absolute;
  left: 0px;

  display: block;

  min-width: 200px;
  max-width: 400px;
  width: fit-content;

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

const ButtonWrap = styled.div`
  position: relative;

  margin: 0;
  padding: 10px;

  > ${Attachment}, > a {
    position: absolute;
    bottom: 10px;
    padding: 5px;
    border-radius: 5px;
  }
  > ${Attachment} {
    left: 10px;
    height: 30px;
  }
  > a {
    right: 10px;
    &:hover {
      background-color: #edf2f6;
    }
  }
`;

const C = {
  CardWrapper,
  Thumbnail,
  Content,
  Block,
  Tag,
  Attachment,
  AttachmentPop,
  ButtonWrap,
};

export default C;