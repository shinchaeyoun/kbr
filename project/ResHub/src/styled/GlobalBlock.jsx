import styled from "styled-components";

const AbsoluteBtn = styled.button`
  position: absolute;
  border: none;
  background-color: transparent;
`;
const Notice = styled.span``;
const Img = styled.img``;
const Thumb = styled.img``;

const Select = styled.select`
  position: relative;

  width: 80px;
  height: 30px;
  border: 1px solid #6580ea;
  border-radius: 5px;

  option {
    text-align: center;
    border: 1px solid #6580ea;
  }
`;

const Button = styled.button`
  border: none;
  border: 1px solid #99999999;
  background-color: ${(props) =>
    props.theme === "light"
      ? "#6580EA"
      : props.theme === "dark"
      ? "#334CB3"
      : "#fff"};
  color: ${(props) =>
    props.theme === "light"
      ? "#fff"
      : props.theme === "dark"
      ? "#fff"
      : "#000"};

  border-radius: 5px;
  height: 25px;
  line-height: 25px;
  padding: 0 10px;
  padding: ${(props) => props.$padding || "0 10px"};
  cursor: pointer;
  font-size: 12px;
  font-family: "Pretendard-Regular", sans-serif;

  &:focus {
    outline: none;
  }

  &.on {
    background-color: #6580ea;
    color: #fff;
    border-color: #fff;
  }
`;

const GridContainer = styled.div`
  display: grid;
  justify-content: center;
  // grid-template-columns: 1fr 1fr;
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "row"};
  align-content: center;
  align-items: center;
  margin-bottom: 10px;

  div:first-child {
    width: 220px;
    text-align: right;
  }

  form {
    display: flex;

    input {
      align-content: center;
    }
  }

  input[type="file" i]::-webkit-file-upload-button {
    border: none;
    border: 1px solid #66a6ff;
    background-color: #fff;
    border-radius: 5px;
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
    cursor: pointer;
  }

  input {
    padding: 0 10px;
    margin-left: 10px;
    height: 30px;
    border-radius: 5px;
    border: none;
    width: ${(props) => {
      if (props.$short) return "100px";
      else if (props.$long) return "400px";
      else return "300px";
    }};
  }

  button {
    margin-left: 10px;
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  gap: 5px;
`;

const Content = styled.div`
  display: flex;
`;

const Input = styled.input`
  cursor: ${(props) => (props.readOnly ? "default" : "text")};

  // dlatl
  width: 500px;
  height: 60px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  outline: none;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrap = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  
`;

const Block = styled.div`
  border: 3px solid #000;
  margin: 10px 0;
  padding: 10px 10px 30px;
`;

const LoginContainer = styled.div``;
const LogoutContainer = styled.div``;
const LogoutButton = styled.button``;
const LoginInput = styled.input``;
const SignupButton = styled.button``;

const Footer = styled.footer`
  height: 15vh;
`;

const CenterBox = styled.div`
  display: flex;
  justify-content: center;
`;

const S = {
  AbsoluteBtn,
  Select,
  Button,
  ButtonWrap,
  Group,
  Img,
  GridContainer,
  GridItem,
  Input,
  FlexBox,
  Wrap,
  Block,
  LoginContainer,
  LogoutContainer,
  LogoutButton,
  LoginInput,
  SignupButton,
  Thumb,
  Notice,
  Footer,
  CenterBox,
  Content,
  Container,
};

export default S;
