//ModalStyled
import styled from "styled-components";
import S from "./GlobalBlock";

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
`;

const GridContainer = styled.div``;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 50px;
  font-family: "NanumSquareB", sans-serif;
`;

const Wrap = styled.div`
  position: relative;
  padding: 60px 80px 0 80px;
`;

const ModalContent = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 660px;
  height: 800px;

  border-radius: 10px;
`;

const ModalWrap = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const M = {
  DeleteBtn,
  CloseBtn,
  Button,
  Img,
  Input,
  Form,
  Group,
  GridItem,
  GridContainer,
  Title,
  Wrap,
  ModalContent,
  ModalWrap,
};

export default M;
