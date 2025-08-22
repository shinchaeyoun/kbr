import styled from "styled-components";

const Notice = styled.span``;
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
  font-family: "NanumSquare", sans-serif;

  &:focus {
    outline: none;
  }

  &.on {
    background-color: #6580ea;
    color: #fff;
    border-color: #fff;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction || "column"};
  gap: 5px;
`;

const Input = styled.input`
  cursor: ${(props) => (props.readOnly ? "default" : "text")};

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

const Block = styled.div`
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 10px 10px 30px;
`;

const Footer = styled.footer`
  // height: 15vh;
`;

const CenterBox = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.h1``;
const S = {
  Select,
  Button,
  ButtonWrap,
  Input,
  FlexBox,
  Block,
  Thumb,
  Notice,
  Footer,
  CenterBox,
  Title
};

export default S;
