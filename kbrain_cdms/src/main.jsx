import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import PrivateEnterRoute from "./route/PrivateEnterRoute";
import "./index.css";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styled/GlobalStyle.jsx";
import media from "./styled/media.jsx";

createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={{ ...media }}>
        <GlobalStyle />
        <PrivateEnterRoute />
      </ThemeProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
