import React, { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { createRoot } from "react-dom/client";
import "./index.css";
import GlobalStyle from "./styled/GlobalStyle.jsx";
import App from "./App.jsx";
import PrivateEnterRoute from "./components/PrivateEnterRoute.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      {/* <App /> */}
      <PrivateEnterRoute />
      {/* <Footer /> */}
    </BrowserRouter>
  </React.StrictMode>
);
