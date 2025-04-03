import styled from "styled-components";

const Notice = styled.span`

`;

const dlatl = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: #ccc;
  font-size: 12px;
`;

const Img = styled.img``;
const Thumb = styled.img``;

const BoardItem = styled.div`
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;

  .buttonWrap {
    position: absolute;
    top: 10px;
    right: 30px;
  }

  .title {
    margin-bottom: 10px;
    padding: 0 0 10px 0;
    border-bottom: 1px dotted #ddd;

    cursor: pointer;
  }

  span {
    display: inline-block;
    margin-right: 5px;
    color: #999;
  }
  span::after {
    content: " :";
  }
`;

const Button = styled.button`
  border: none;
  border: 1px solid #66a6ff;
  background-color: #fff;
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &.on {
    background-color: #66a6ff;
    color: #fff;
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
  select {
    padding: 0 5px;
    margin-left: 10px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #66a6ff;
    background-color: #fff;
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

const BoardGridItem = styled.div`
  position: relative;
  display: flex;

  justify-content: space-between;
  align-items: center;
  // gap: 10px;
  padding: 0 20px;

  border: 1px solid #ddd;

  min-height: 100px;

  ${Thumb} {
    width: 90px;
    height: 50px;
    object-fit: cover;
  }

  .title {
    width: 200px;
    text-align: center;
  }
`;

const BoardGridContainer = styled.div`
  display: grid;
  justify-content: center;
  // grid-template-columns: ${(props) => props.type === "card" ? `repeat((props.$cl), 1fr)` : "repeat(2, 1fr)"};
  grid-template-columns: ${(props) => props.type === "card" ?  `repeat(${(props.$cl)}, 1fr)` : "repeat(2, 1fr)"};
  gap: 10px;

  /* 부모 영역을 넘어가지 않도록 설정 */
  max-width: 100%; /* 부모의 너비를 초과하지 않음 */
  max-height: 100%; /* 부모의 높이를 초과하지 않음 */

  cursor: pointer;

  ${BoardGridItem}, ${Group} {
    padding: 10px 0;
    flex-direction: ${(props) => (props.type === "card" ? "column" : "row")};
  }
  ${Group} {
    .title {
      white-space: nowrap; /* 텍스트를 한 줄로 유지 */
      overflow: hidden; /* 넘치는 텍스트를 숨김 */
      text-overflow: ellipsis; /* 넘치는 텍스트를 ...으로 표시 */
    }
  }

  ${Thumb} {
    width: ${(props) => props.type === "card" && `200px`};
    height: ${(props) => props.type === "card"&& `110px`};
    object-fit: cover;
  }

  ${ButtonWrap} {
    flex-direction: ${(props) => (props.type === "card" ? "row" : "column")};
  }
`;

const Input = styled.input`
  cursor: ${(props) => (props.readOnly ? "default" : "text")};
  background-color: ${(props) => {
    if (props.$req) return "#ffe19e";
    else return "#ecf2ff";
  }};
`;

const FlexBox = styled.div`
  display: flex;
`;

const Wrap = styled.div`
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
`;

const Block = styled.div`
  border: 1px solid #ddd;
  margin: 10px 0;
  padding: 10px 10px 30px;
`;

const LoginContainer = styled.div``;
const LogoutContainer = styled.div``;
const LogoutButton = styled.button``;
const LoginInput = styled.input``;
const SignupButton = styled.button``;

const S = {
  ButtonWrap,
  BoardItem,
  Button,
  BoardGridContainer,
  BoardGridItem,
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
  dlatl,
  Notice,
};

export default S;
