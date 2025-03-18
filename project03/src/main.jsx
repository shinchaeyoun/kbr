import React, { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <App />
      {/* <Footer /> */}
    </BrowserRouter>
  </React.StrictMode>
);
