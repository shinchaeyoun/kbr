//ProgressStyled
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  justify-items: center;
  align-items: center;
`;

const Button = styled(S.Button)``;

const Title = styled(S.Title)`
  // margin-bottom: 20px;
`;

const Container = styled.div``;

const Group = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
`;

const BarTitle = styled(Title)`
  width: 75px;
  flex-shrink: 0;
`;
const CheckTitle = styled(Title)`
  margin-bottom: 7px;
`;

const BarContainer = styled(Container)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 50px;

  margin-top: 20px;
  margin-bottom: 30px;
`;
const BarContent = styled.div`
  display: flex;
  gap: 5px;
  width: 90%;
`;
const Bar = styled.div`
  display: flex;
  width: 100%;
  height: 20px;
  background-color: #f5f5f5;
  border-radius: 20px;
`;
const BarProgress = styled.div`
  width: ${(props) => props.$per || "0%"};
  height: 100%;
  background-color:rgb(63, 197, 250);
  transition: width 0.3s ease-in-out;
  border-radius: 20px;
  text-align: right;

  span {
    color: #fff;
    padding: 0 8px;
  }
`;
const BarProgress2 = styled.div`
  width: ${(props) => props.$per || "0%"};
  height: 100%;
  background-color:rgb(255, 230, 146);
  transition: width 0.3s ease-in-out;
  border-radius: 20px;
  text-align: right;

  span {
    color: #fff;
    padding: 0 8px;
  }
`;

const NumCate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
`;
const Num = styled.span`
  font-size: 0.8rem;
  color: #333;
`;

const CheckContainer = styled(Container)`
  > ${Group} {
    flex-direction: column;
    margin-bottom: 50px;
  }

  > ${Button} {
    margin-bottom: 20px;
  }
`;

const TitleWrap = styled(GridContainer)`
  background-color: #d9d9d9;
  padding: 10px 20px;
`;

// const InnerContainer = styled(GridContainer)`
const InnerContainer = styled.div`
  padding: 10px 20px;
`;
const Line = styled(GridContainer)`
  margin-bottom: 30px;

  select.before,
  option.before {
    background-color: #e9e9e9;
    border-color: #c2c2c2;
  }
  
  select.ing,
  option.ing {
    background-color: #ffebab;
    border-color:rgb(247, 214, 105);
  }
    
  select.edit,
  option.edit {
    background-color: #dfcfee;
    border-color:rgb(202, 166, 235);
  }
    
  select.firstDone,
  option.firstDone {
    background-color: #cae6b4;
    border-color: #9fd675;
  }
    
  select.done,
  option.done {
    background-color: #a4ddf3;
    border-color:rgb(117, 200, 233);
  }
`;

const CheckGroup = styled(Group)`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  div {
    display: flex;
    align-items: center;
    gap: 7px;

    input[type="checkbox"] {
      margin: 0px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }
`;

const P = {
  Title,
  Container,
  Group,
  BarTitle,
  CheckTitle,
  BarContainer,
  BarContent,
  Bar,
  BarProgress,
  BarProgress2,
  NumCate,
  Num,
  CheckContainer,
  TitleWrap,
  InnerContainer,
  Line,
  CheckGroup,
  Button,
};

export default P;
