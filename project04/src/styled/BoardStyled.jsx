//BoardStyled
import styled from "styled-components";
import S from "./GlobalBlock";

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
  P {
    position: relative;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
`;

const GridContainer = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: ${(props) =>
    props.type === "card" ? `repeat(${props.$cl}, 1fr)` : "repeat(2, 1fr)"};
  gap: 31px 20px;

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

    width: ${(props) => (props.type === "card" && `100%`) || "620px"};
    height: ${(props) => (props.type === "card" && `210px`) || "70px"};

    border: ${(props) =>
      (props.type === "card" && `none`) || "1px solid #aaaaaa"};
    border-radius: ${(props) => (props.type === "card" && `0px`) || "5px"};
  }

  ${S.Thumb} {
    width: ${(props) => (props.type === "card" && `100%`) || "90px"};
    height: ${(props) => (props.type === "card" && `180px`) || "50px"};
    object-fit: cover;
    border: 1px solid #aaaaaa;
    border-radius: 5px;
  }

  ${Title} {
  }

  ${S.ButtonWrap} {
    flex-direction: ${(props) => (props.type === "card" ? "row" : "column")};
  }
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
};

export default B;
