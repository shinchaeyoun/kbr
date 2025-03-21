import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [level, setLevel] = useState(Number(sessionStorage.getItem("user_lvl")) || 0);
  const [userId, setUserId] = useState(sessionStorage.getItem("user_id") || null);

  const login = (id, lvl) => {
    sessionStorage.setItem("user_id", id);
    sessionStorage.setItem("user_lvl", lvl);
    setUserId(id);
    setLevel(lvl);
  };

  const logout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("user_lvl");
    setUserId(null);
    setLevel(0);
  };

  const isAuthenticated = level > 0;

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, level, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
