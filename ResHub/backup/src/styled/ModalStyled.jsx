//ModalStyled
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const DeleteBtn = styled.button`
  font-weight: 600;
  float: right;
  background-color: initial;
  border: none;
  margin-top: 5px;
`;
const CloseBtn = styled(S.Button)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: auto;
  height: auto;
  padding: 0;
  line-height: 0;
  border: none;
`;

const Button = styled(S.Button)`
  width: 500px;
  height: 40px;
  color: #fff;
  font-size: 20px;
  background-color: #6580ea;
  font-weight: 600;
`;

const Img = styled.img`
  justify-content: center;
  width: 160px;
  height: 90px;
  object-fit: cover;
`;

const Input = styled.input`
  padding-left: 12px;
  width: 500px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  outline: none;

  &[type="file" i]:disabled::-webkit-file-upload-button {
    opacity: 1;
    color: #000 !important;
  }
`;

const Textarea = styled.textarea`
  width: 500px;
  min-height: 84px;

  border: 1px solid #d9d9d9;
  border-radius: 5px;
  resize: none;

  font-size: 16px;
`;

const Form = styled.form`
  input {
    padding: 7px;
  }
  input[type="file" i]::-webkit-file-upload-button {
    border: none;
    border: 1px solid #999999;
    background-color: #fff;
    border-radius: 5px;
    height: 25px;
    line-height: 25px;
    // padding: 0 10px;
    cursor: pointer;
    width: 60px;
    height: 25px;

    font-size: 12px;
  }
`;

const Group = styled.div`
  display: flex;
  width: 500px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  padding: 5px;

  &.warning {
    border-color: red;
    ${S.Select} {
      border-color: red;
    }
  }

  ${S.Select} {
    flex-shrink: 0;

    &:disabled {
      border: 1px solid #d9d9d9;
      opacity: 1;
      color: #000 !important;
    }
  }

  ${Input} {
    border: none;
    outline: none;
    background-color: initial;
    border-radius: 0;
    width: 100%;
    height: 100%;
    padding-left: 10px;
  }
`;

const SubTitle = styled.div`
  display: inline-block;
`;

const GridItem = styled.div`
  margin: ${(props) => props.$margin || "0 0 15px 0"};

  > div {
    margin-bottom: 5px;
  }

  > div span {
    color: red;
    margin-left: 5px;
    font-size: 13px;
  }

  > ${S.Notice} {
    font-size: 14px;
    color: #777777;
  }

  &.emptyLink {
    ${SubTitle} {
      animation: shake 0.7s ease-in-out;
    }
    ${Input} {
      border: 1px solid red;
    }
  }

  @keyframes shake {
    0%,
    100% {
      color: red;
      transform: translateX(0);
    }
    25% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(1deg);
    }
    75% {
      transform: rotate(-2deg);
    }
  }




  .fileList {
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    margin-top: 5px;
    // margin: 10px 0;

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
        font-family: "NanumSquareNeo", sans-serif;
        font-size: 14px;
        &:hover {
          color: #000;
          text-decoration: underline;
        }
      }
    }
  }

`;

const GridContainer = styled.div`
  width: 500px;
`;

const Description = styled.div`
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 900;
  // text-align: center;
  margin-bottom: 50px;
  font-family: "NanumSquareB", sans-serif;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 200px;
  height: 40%;
  background-color: #f5f5f5;

`;

const Wrap = styled.div`
  position: relative;
  padding: 60px 80px 0 80px;

  height: 100%;
  overflow-y: scroll;
`;

const ModalContent = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  height: 90%;
  overflow: hidden;

  border: 3px solid #000;
  border-radius: 10px;


  ${media.tab`
    width: 90%;

    ${Wrap} {
      padding: 40px 30px 60px 30px;

      ${S.Select} {
        // width: 100%;
        // height: 40px;
        // border-radius: 5px;
        // border: 1px solid #d9d9d9;
        // padding-left: 12px;
      }

      ${Group}, ${Input}, ${Button} {
        width: 100%;
      }
    }
  `}

  ${media.mbl`
    ${Title} {
      margin-bottom: 30px;
    }
    ${SubTitle} {
      span {
        display: inline-block;
      }
    }
  `}
`;

const ModalWrap = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color:rgba(237, 242, 246, 0.6);
  z-index: 999;
`;

const M = {
  DeleteBtn,
  CloseBtn,
  Button,
  Img,
  Input,
  Textarea,
  Form,
  Group,
  SubTitle,
  GridItem,
  GridContainer,
  Description,
  Title,
  Thumbnail,
  Wrap,
  ModalContent,
  ModalWrap,
};

export default M;
