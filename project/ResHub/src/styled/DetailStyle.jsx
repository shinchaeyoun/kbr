//DetailStyle
import styled from "styled-components";
import S from "./GlobalBlock.jsx";
import M from "./MainStyled.jsx";
import media from "./media.jsx";

const Thumbnail = styled.div`
  width: 300px;
  min-height: 170px;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
  background-image: ${({ $bg }) => ($bg && $bg !== "null" ? `url(${$bg})` : "url(/images/thumbnail/default.png)")};
  background-size: cover;
  background-position: center;
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 0 20px;

  .title {
    display: flex;
    justify-content: space-between;
  }

  .info {
    border-bottom: 1px solid #e4e6eb;
    margin-bottom: 20px;
    padding-bottom: 10px;
    .user {
    }

    .block {
      display: flex;
      gap: 0 10px;
      margin-bottom: 10px;
      font-size: 12px;
      .date {
        color: #71767a;
      }

      .views {
        color: #118dff;
      }
    }

    .flex {
      display: flex;
      justify-content: space-between;
      div {
        width: 100%;

        .attachmentTitle {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        ul {
          margin: 10px 0 0;
          // padding: 10px 20px;
          border: 1px solid #eaeaea;
          li {
            cursor: pointer;
            // margin-bottom: 10px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            padding: 10px;

            &:last-child {
              margin-bottom: 0;
            }

            &:hover {
              background-color: #f5f5f5;
            }

            div {
              display: flex;
              gap: 0 10px;
              align-items: center;
            }
          }
        }
      }
    }

    .grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      align-items: center;
      gap: 10px;

      .innerUrl,
      .outerUrl {
        div {
          word-break: break-all;
          color: #118dff;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .innerUrl {
      margin: 10px 0;
    }
  }

  .content {
    margin-top: 20px;
    line-height: 1.4;

    border-bottom: 1px solid #e4e6eb;
    margin-bottom: 20px;
    padding-bottom: 20px;
  }
`;

const Block = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  margin-bottom: 10px;
  gap: 10px 0;

  div:first-child p {
    padding-top: 5px;
  }
`;

const Input = styled(S.Input)`
  width: 100%;
  height: 35px;

  align-content: center;
  padding: 0 5px;

  &[type="file" i]::-webkit-file-upload-button {
    border: none;
    border: 1px solid #99999999;
    background-color: ${(props) => (props.theme === "light" ? "#6580EA" : props.theme === "dark" ? "#334CB3" : "#fff")};
    color: ${(props) => (props.theme === "light" ? "#fff" : props.theme === "dark" ? "#fff" : "#000")};

    border-radius: 3px;
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
    padding: ${(props) => props.$padding || "0 10px"};
    margin: 0 5px 0 0;
    cursor: pointer;
    font-size: 13px;
    // font-family: "NanumSquare", sans-serif;

    &:focus {
      outline: none;
    }

    &.on {
      background-color: #6580ea;
      color: #fff;
      border-color: #fff;
    }
  }
`;

const Textarea = styled.textarea`
  width: 970px;
  width: 100%;
  height: 570px;
  height: 200px;
  padding: 10px;
  border: 1px solid #d9d9d9;
  resize: vertical;
  resize: none;
  outline: none;
`;

const Select = styled(S.Select)`
  width: 110px;
  border-color: #aaa;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;

  .fileList {
    border: 1px solid #d9d9d9;

    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 10px;

      &:hover {
        background-color: #f5f5f5;
      }

      .box {
        display: flex;
        gap: 0 10px;
        padding: 0;
      }

      span {
        cursor: pointer;
        color: #777777;
        // font-family: "NanumSquareNeo", sans-serif;
        font-size: 14px;
        &:hover {
          color: #000;
          text-decoration: underline;
        }
      }
    }
  }
`;

const RightBox = styled(M.RightBox)`
  // margin-bottom: 20px;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 24px;
`;

const Tag = styled.div`
  cursor: pointer;
  color: #777777;
  font-size: 14px;

  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 5px 30px 5px 10px;

  display: inline-block;

  &:hover {
    color: #000;
    background-color: #f5f5f5;

    &::before {
      color: #f00;
    }
  }

  position: relative;

  &::before {
    content: "X";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #777777;
  }
`;

const TagWrap = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: start;
  // align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  height: auto
  padding: 10px;

  input {
    height: 35px;
    margin: 10px;
    padding: 0 10px;
    outline: none;
    border: none;
    font-size: 14px;
    // font-family: "NanumSquare", sans-serif;
  }

  >div {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    width: 100%;

    .tag {
      cursor: pointer;
      color: #777777;
      // font-family: "NanumSquareNeo", sans-serif;
      font-size: 14px;

      border: 1px solid #d9d9d9;
      border-radius: 5px;
      padding: 5px 30px 5px 10px;

      display: inline-block;

      &:hover {
        color: #000;
        background-color: #f5f5f5;

        &::before {
          color: #f00;
        }
      }

      position: relative;

      &::before {
        content: "X";
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        color: #777777;
      }
    }
  }
`;

const TagList = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  ${Tag}{
    padding: 5px 10px 5px 10px;
    &::before {
    display: none;
  }
`;

const RadioItem = styled.label`
  input {
  }
`;

const BlockWrapper = styled.div`
  margin-bottom: 20px;

  &.chasi-form {
    background-color: #e7ecf3ff;
    border: 2px solid #bfc8d5;
    padding: 20px;
    padding-bottom: 1px;
    border-radius: 10px;

    ${RightBox} {
      margin-top: 30px;
      gap: 5px;
    }

    .type {
    }
  }
`;

const ChasiContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  position: relative;
  background-color: #f8fbffff;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #d6e7ffff;

  ${Block} {
    grid-template-columns: 100px 1fr;
    align-items: center;
  }

  ${Input} {
    &.activated {
      color: #007bff;
      text-decoration: underline;
    }
  }

  ${S.ButtonWrap} {
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    width: initial;
  }

  &.edit-mode {
    background-color: #e1eeff;
    border: 2px solid #a1b8d8ff;
  }
`;

const ChasiWrapper = styled(Wrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .title {
    align-items: center;
    gap: 20px;

    ${Title} {
      width: 100%;
      align-items: center;
      gap: 0 5px;
      ${Select} {
        margin-top: 4px;
      }
      ${Input} {
        border: none;
        font-size: 24px;
        pointer-events: none;
        &:hover {
          cursor: pointer;
        }
        &.edit {
          outline: 1px solid #d9d9d9;
          box-sizing: border-box;
        }
      }
    }

    ${S.ButtonWrap} {
      flex-shrink: 0;
    }
  }
`;

const D = {
  Wrapper,
  BlockWrapper,
  Block,
  Input,
  Textarea,
  Select,
  Content,
  RightBox,
  Title,
  TagWrap,
  TagList,
  Tag,
  RadioItem,
  ChasiWrapper,
  ChasiContent,
  Thumbnail
};

export default D;
