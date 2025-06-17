/* eslint-disable */
import { createGlobalStyle } from "styled-components";
import NanumSquareL from "./font/NanumSquareL.otf";
import NanumSquareR from "./font/NanumSquareR.otf";
import NanumSquareB from "./font/NanumSquareB.otf";
import NanumSquareEB from "./font/NanumSquareEB.otf";

import OutfitRegular from "./font/Outfit-Regular.ttf";
import OutfitBold from "./font/Outfit-Bold.ttf";

const GlobalStyles = createGlobalStyle`
  :root {
    --header-height: 152px; /* 헤더 높이를 60px로 설정 */
    --footer-height: 15vh; /* 헤더 높이를 60px로 설정 */
    
    /* 색상 변수 설정 */  
    --label-pink: #ffafbd;
    --label-green: #a2ab58;
    --label-blue: #66a6ff;
    --label-yellow: #f7b733;
  }

  @font-face {
    font-family: 'OutfitRegular';
    src: local('OutfitRegular'), local('OutfitRegular');
    font-style: normal;
    src: url(${OutfitRegular}) format('truetype');
  }
  @font-face {
    font-family: 'OutfitBold';
    src: local('OutfitBold'), local('OutfitBold');
    font-style: normal;
    src: url(${OutfitBold}) format('truetype');
  }



  @font-face {
    font-family: 'NanumSquareL';
    src: local('NanumSquareL'), local('NanumSquareL');
    font-style: normal;
    src: url(${NanumSquareL}) format('truetype');
  }
  @font-face {
    font-family: 'NanumSquareR';
    src: local('NanumSquareR'), local('NanumSquareR');
    font-style: normal;
    src: url(${NanumSquareR}) format('truetype');
  }
  @font-face {
    font-family: 'NanumSquareB';
    src: local('NanumSquareB'), local('NanumSquareB');
    font-style: normal;
    src: url(${NanumSquareB}) format('truetype');
  }
  @font-face {
    font-family: 'NanumSquareEB';
    src: local('NanumSquareEB'), local('NanumSquareEB');
    font-style: normal;
    src: url(${NanumSquareEB}) format('truetype');
  }

  body {
    position: relative;
    font-family: 'NanumSquareR';
  }
`;

export default GlobalStyles;
