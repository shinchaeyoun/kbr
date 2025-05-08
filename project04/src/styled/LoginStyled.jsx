//LoginStyled
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const Button = styled(S.Button)`
  width: 500px;
  height: 60px;
  font-family: "NanumSquareB", sans-serif;
`;

const SignupBtn = styled(Button)`
  font-size: 17px;
  color: #555;
  border: none;
`;
const LoginBtn = styled(Button)`
  font-size: 24px;
  color: #fff;
`;

const Input = styled(S.Input)`
  font-size: 20px;
  padding-left: 24px;
`;

const Inner = styled(S.Input)`
  display: flex;
  align-items: center;
  padding: 4px;
  > ${Input} {
    width: 100%;
    height: 100%;
    border: none;
  }

  > ${S.Button} {
    flex-shrink: 0;
    padding: 0;
    width: 80px;
    height: 50px;
    font-size: 14px;
    font-weight: 700;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 16px;
    font-family: "NanumSquareB", sans-serif;
    margin-bottom: 5px;
  }

  label span {
    font-size: 12px;
    padding-left: 5px;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: 50px;
  margin-bottom: 50px;

  h1 {
    font-family: "NanumSquareNeoHeavy", sans-serif;
    font-size: 40px;
  }

  span {
    display: inline-block;
    margin-left: 4px;
    font-family: "Orbit-Regular", sans-serif;
    font-size: 14px;
    letter-spacing: -1px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 18px;

  ${media.tab`
    margin-bottom: 50px;
    ${Group}, ${Input}, ${S.ButtonWrap}, ${Button}, ${Inner} {
      width: 100%;
    }

  `}
`;

const L = {
  SignupBtn,
  LoginBtn,
  Button,
  Input,
  Inner,
  Group,
  Logo,
  Container,
};

export default L;
