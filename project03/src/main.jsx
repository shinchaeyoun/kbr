import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import GlobalStyle from "./styled/GlobalStyle.jsx";
import App from "./App.jsx";
import { AuthProvider } from "./AuthProvider";
import PrivateEnterRoute from "./components/PrivateEnterRoute";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
          <GlobalStyle />
          {/* <App /> */}
          <PrivateEnterRoute />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
