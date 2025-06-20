//BoardStyled
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const Search = styled.div`
  ${S.Input} {
    width: 250px;
    margin: 0 10px;
    height: 20px;
    background-color: initial;
    border: none;
    font-size: 14px;

    &:-internal-autofill-selected {
      background-color: initial;
    }
  }

  option:hover {
    background-color: #ddd;
  }
`;

const Button = styled(S.Button)`
  width: 80px;
  height: 30px;
  font-family: "NanumSquareNeoBold", sans-serif;
  font-size: 14px;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0 10px;

  margin: 0 auto 10px;
  padding: 5px;

  width: 600px;
  height: 40px;

  border: 1px solid #6580ea;
  border-radius: 7px;

  select {
    width: 80px;
    height: 30px;
    border: 1px solid #6580ea;
  }
`;

const SearchContent = styled.div`
  select {
  }

  input {
  }
`;

const Icon = styled.div`
  position: relative;
  width: 13px;
  height: 13px;
  border: 1px solid;
`;

const ListIcon = styled(Icon)`
  border-left: none;
  border-right: none;
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 13px;
    height: 1px;
    border-top: 1px solid;
    transform: translateY(-50%);
  }
`;

const Title = styled.div`
  font-size: 14px;
  font-family: "NanumSquareNeoBold", sans-serif;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ListTitle = styled(Title)`
  padding-left: 10px;
  span {
    color: #777777;
    font-family: "NanumSquareNeo", sans-serif;
  }
`;
const CardTitle = styled(Title)`
  width: 200px;

  p {
    position: relative;
    padding-left: 5px;
    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      background: #000;
      width: 2px;
      height: 100%;
    }
  }
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;

  ${S.Button} {
    border: none;

    &:hover {
      background-color: #ddd;
    }
  }
`;

const BoardItem = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  > span {
    // dlatl
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 14px;
    font-family: "NanumSquareNeoBold", sans-serif;
    color: #777;
    background-color: #fff;
  }
`;

const GridContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: ${(props) =>
    props.type === "card" ? `repeat(5, 1fr)` : "1fr"};
  gap: 16px 20px;

  max-width: 100%;
  max-height: 100%;
  cursor: pointer;

  ${BoardItem} {
    position: relative;
    align-items: ${(props) =>
      props.type === "card" ? "flex-start" : "center"};
    flex-direction: ${(props) => (props.type === "card" ? "column" : "row")};
    gap: 10px 0;

    padding: ${(props) =>
      (props.type === "card" && `0`) || "10px 3px 10px 10px"};

    min-width: ${(props) => props.type === "list" && `490px`};
    width: ${(props) => (props.type === "card" && `100%`) || "100%"};
    height: ${(props) => (props.type === "card" && `210px`) || "70px"};

    border: ${(props) =>
      (props.type === "card" && `none`) || "1px solid #aaaaaa"};
    border-radius: ${(props) => (props.type === "card" && `0px`) || "5px"};
  }

  ${S.Thumb} {
    width: ${(props) => (props.type === "card" && `100%`) || "180px"};
    height: ${(props) => (props.type === "card" && `180px`) || "50px"};
    object-fit: cover;
    border: 1px solid #aaaaaa;
    border-radius: 5px;
    flex-shrink: 0;
  }

  ${S.ButtonWrap} {
    flex-direction: ${(props) => (props.type === "card" ? "row" : "column")};
  }

  ${media.deskL`
    // color: green;
    grid-template-columns: ${(props) =>
      props.type === "card" ? `repeat(4, 1fr)` : "repeat(2, 49%)"};
    justify-items: center;

    ${ListTitle} {
      width: 360px;
    }
  `}

  ${media.desk`
    // color: pink;
    grid-template-columns: ${(props) =>
      props.type === "card" ? `repeat(3, 1fr)` : "repeat(1, 1fr)"};

      ${ListTitle} {
      width: 100%;
    }
  `}
  
  ${media.tab`
    // color: red;
    grid-template-columns: ${(props) =>
      props.type === "card" && `repeat(2, 1fr)`};
  `}

  ${media.mbl`
    // color: blue;
    grid-template-columns: ${(props) =>
      props.type === "card" ? `repeat(1, 1fr)` : "repeat(1, 1fr)"};
  `}
`;

const CardIcon = styled(Icon)``;

const Container = styled.div`
  > ${S.ButtonWrap} {
    margin-bottom: 10px;
  }
`;

const CenterBox = styled(S.CenterBox)`
  margin: 50px 0 0;
`;

const Select = styled(S.Select)`
  width: 110px;
`;

const Option = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  // align-items: center;
  margin-bottom: 8px;

  div:first-child p {
    padding-top: 5px;
  }
`;
const OptionWrap = styled.div`
  margin-bottom: 20px;
`;
const ButtonWrap = styled(S.ButtonWrap)`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  padding-bottom: 10px;
`;

const Input = styled(S.Input)`
  width: 100%;
  height: 35px;

  align-content: center;
  padding: 0 5px;
`;

const Textarea = styled.textarea`
  width: 970px;
  width: 100%;
  height: 570px;
  border: 1px solid #d9d9d9;
  resize: vertical;
  resize: none;

  outline: none;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;

  .fileList {
    border: 1px solid #d9d9d9;
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

const B = {
  Button,
  ListIcon,
  CardIcon,
  Search,
  SearchContent,
  SearchContainer,
  Title,
  ListTitle,
  CardTitle,
  Group,
  BoardItem,
  GridContainer,
  Container,
  CenterBox,

  ButtonWrap,
  Button,
  Select,
  Option,
  OptionWrap,
  Input,
  Textarea,
  Content,
};

export default B;
