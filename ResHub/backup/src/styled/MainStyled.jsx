//MainStyled
import styled from "styled-components";
import S from "./GlobalBlock";
import media from "./media.jsx";

const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 256px 1fr;
  bacground-color: #EDF2F6;
  
  nav {
    border: 1px solid #ccc;
  }

  main {
    border: 1px solid #ccc;

    section {
    }
  }
`;

const ItemWrapper = styled(S.GridContainer)`
  grid-template-columns: repeat(auto-fill, minmax(280px, 320px));
  gap: 20px;
`;

const M = {
  MainWrapper,
  ItemWrapper,
};

export default M;
