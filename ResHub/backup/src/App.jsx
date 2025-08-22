import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// pages
import Main from "./pages/Main.jsx";
import Item from "./pages/Item.jsx";

// components
import Footer from "./components/Footer.jsx";

function App(props) {
  const level = props.level;
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLogin(userId !== null && userId !== undefined);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Main level={level} />} />

        <Route path="/:idx" element={<Item level={level} />}></Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
