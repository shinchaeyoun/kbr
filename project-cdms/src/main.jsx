import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import "./index.css";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styled/GlobalStyle.jsx";
import media from "./styled/media.jsx";
import PrivateEnterRoute from "./route/PrivateEnterRoute.jsx";
import App from "./App.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={{...media}}>
        <GlobalStyle />
        <PrivateEnterRoute />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
