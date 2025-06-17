import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import GlobalStyle from "./styled/GlobalStyle.jsx";
import PrivateEnterRoute from "./route/PrivateEnterRoute";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <PrivateEnterRoute />
    </BrowserRouter>
  </React.StrictMode>
);
