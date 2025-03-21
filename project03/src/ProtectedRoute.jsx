import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children, requiredLevel }) => {
  const { isAuthenticated, level } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredLevel && level < requiredLevel) {
    return <Navigate to="/public" />;
  }

  return children;
};

export default ProtectedRoute;
