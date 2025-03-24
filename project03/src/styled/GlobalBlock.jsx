import styled from "styled-components";

const BoardItem = styled.div`
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ddd;

  .buttonWrap {
    position: absolute;
    top: 10px;
    right: 30px;

    // color: #999;
    // font-size: 14px;
    // border: 1px solid #999;
    // padding: 3px 5px;
    // border-radius: 5px;
    // height: initial;
    // line-height: initial;
  }

  .title {
    margin-bottom: 10px;
    padding: 0 0 10px 0;
    border-bottom: 1px dotted #ddd;
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
  // background-color: #66a6ff;
  border: 1px solid #66a6ff;
  background-color: #fff;
  // color: #fff;
  // font-weight: 600;
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;

  &:focus {
    outline: none;
  }
`;

const GridContainer = styled.div`
  display: grid;
  justify-content: center;
  // grid-template-columns: 1fr 1fr;
`;

const GridItem = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  margin-bottom: 10px;

  div:first-child {
    width: 220px;
    text-align: right;
  }

  input {
    padding: 0 10px;
    margin-left: 10px;
    height: 30px;
    border-radius: 5px;
    border: none;
    // background-color: #ecf2ff;
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
    // width: 300px;
  }

  button {
    margin-left: 10px;
  }
`;

const Input = styled.input`
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
`

const S = {
  BoardItem,
  Button,
  GridContainer,
  GridItem,
  Input,
  FlexBox,
  Wrap,
  Block
};

export default S;
