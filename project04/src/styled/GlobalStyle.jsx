/* eslint-disable */
import { createGlobalStyle } from "styled-components";
import NanumSquareL from "./font/NanumSquareL.otf";
import NanumSquareR from "./font/NanumSquareR.otf";
import NanumSquareB from "./font/NanumSquareB.otf";
import NanumSquareEB from "./font/NanumSquareEB.otf";

const GlobalStyles = createGlobalStyle`
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


  @font-face {
      font-family: 'Pretendard-Regular';
      src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
      font-weight: 400;
      font-style: normal;
  }

  @font-face {
      font-family: 'NanumSquareNeoLight';
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-aLt.eot);
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-aLt.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-aLt.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-aLt.ttf) format("truetype");
  }

  @font-face {
      font-family: 'NanumSquareNeo';
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.eot);
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-bRg.ttf) format("truetype");
  }

  @font-face {
      font-family: 'NanumSquareNeoBold';
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.eot);
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-cBd.ttf) format("truetype");
  }

  @font-face {
      font-family: 'NanumSquareNeoExtraBold';
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-dEb.eot);
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-dEb.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-dEb.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-dEb.ttf) format("truetype");
  }

  @font-face {
      font-family: 'NanumSquareNeoHeavy';
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-eHv.eot);
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-eHv.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-eHv.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeoTTF-eHv.ttf) format("truetype");
  }

  @font-face {
      font-family: 'NanumSquareNeoVariable';
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeo-Variable.eot);
      src: url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeo-Variable.eot?#iefix) format("embedded-opentype"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeo-Variable.woff) format("woff"), url(https://hangeul.pstatic.net/hangeul_static/webfont/NanumSquareNeo/NanumSquareNeo-Variable.ttf) format("truetype");
  }

  @font-face {
      font-family: 'Orbit-Regular';
      src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2310@1.0/Orbit-Regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
  }
      

  body {
    position: relative;
    font-family: 'NanumSquareR';
    // background-color: #edf2f6;
    // -ms-overflow-style: none;
  }
`;

export default GlobalStyles;
