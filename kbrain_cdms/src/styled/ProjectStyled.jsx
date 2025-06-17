//ProjectStyled
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const ProjectTitle = styled.div`
  margin-bottom: 20px;
  padding-right: 5px;
  font-size: 18px;
  font-weight: bold;
`;

const SubTabs = styled.ul``;

const Tabs = styled.ul`
  border-right: 1px solid #ddd;
  width: 220px;
  cursor: pointer;
  flex-shrink: 0;

  .project_title {
    margin-bottom: 20px;
    font-size: 20px;
  }
  

   > li {
    margin-bottom: 15px;
    > ul {
      margin-left: 20px;
      > li {
        padding-top: 15px;
        // margin-bottom: 15px;
        > ul {
          margin-left: 20px;
          > li {
            padding-top: 10px;
            margin-bottom: 5px;
            font-size: 14px;
          }
        }
      }
    }
   }
`;  

const Wrap = styled.div`
  display: flex;

  > section {
    padding: 0 20px;
  }
`;

const P = {
  ProjectTitle,
  SubTabs,
  Tabs,
  Wrap
};

export default P;
